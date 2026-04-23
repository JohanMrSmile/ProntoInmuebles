-- =============================================
-- ProntoHogar — Supabase Schema Migration
-- Lead Attribution & Event Tracking System
-- =============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. LEADS TABLE
-- =============================================
-- Stores every lead captured via forms, WhatsApp CTAs,
-- or phone clicks. De-duplicated by phone number.

CREATE TABLE IF NOT EXISTS leads (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),

  -- Contact info
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,

  -- Context
  service     TEXT DEFAULT 'general',
  message     TEXT DEFAULT '',
  page        TEXT,
  status      TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'lost')),
  notes       TEXT,

  -- Attribution (UTM)
  visitor_id   TEXT,
  session_id   TEXT,
  utm_source   TEXT,
  utm_medium   TEXT,
  utm_campaign TEXT,
  utm_term     TEXT,
  utm_content  TEXT,
  referrer     TEXT,

  -- Server metadata
  ip          TEXT,
  user_agent  TEXT,
  source      TEXT  -- 'form', 'whatsapp', 'phone', 'manual'
);

-- Index for phone dedup queries
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads (phone);

-- Index for UTM campaign analysis
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON leads (utm_source);
CREATE INDEX IF NOT EXISTS idx_leads_utm_campaign ON leads (utm_campaign);

-- Index for status filter
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);


-- =============================================
-- 2. EVENTS TABLE
-- =============================================
-- Stores all tracked user events (page views, clicks,
-- scroll depth, time on site, etc.)

CREATE TABLE IF NOT EXISTS events (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),

  -- Event data
  event_type  TEXT NOT NULL CHECK (event_type IN (
    'page_view',
    'whatsapp_click',
    'scroll_depth',
    'time_on_site',
    'cta_click',
    'form_submit',
    'phone_click',
    'property_view',
    'service_view'
  )),
  url         TEXT DEFAULT '',

  -- User identification (anonymous)
  visitor_id  TEXT,
  session_id  TEXT,

  -- Attribution (UTM)
  utm_source   TEXT,
  utm_medium   TEXT,
  utm_campaign TEXT,
  utm_term     TEXT,
  utm_content  TEXT,
  referrer     TEXT,

  -- Extra data (JSON blob for flexibility)
  metadata    JSONB DEFAULT '{}',

  -- Server metadata
  ip          TEXT,
  user_agent  TEXT
);

-- Index for event type queries
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events (event_type);

-- Index for visitor session reconstruction
CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON events (visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events (session_id);

-- Index for date range analysis
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC);

-- Index for campaign attribution reports
CREATE INDEX IF NOT EXISTS idx_events_utm_source ON events (utm_source);
CREATE INDEX IF NOT EXISTS idx_events_utm_campaign ON events (utm_campaign);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_events_type_date ON events (event_type, created_at DESC);


-- =============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================
-- Enable RLS but allow service role full access.
-- The API routes use the service_role key.

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: service role can do everything
CREATE POLICY "Service role full access on leads"
  ON leads FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on events"
  ON events FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy: anon can insert (for client fallback)
CREATE POLICY "Anon can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anon can insert events"
  ON events FOR INSERT
  WITH CHECK (true);


-- =============================================
-- 4. USEFUL VIEWS
-- =============================================

-- Lead summary by campaign
CREATE OR REPLACE VIEW lead_attribution AS
SELECT
  COALESCE(utm_source, 'direct') AS source,
  COALESCE(utm_campaign, 'none') AS campaign,
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (WHERE status = 'new') AS new_leads,
  COUNT(*) FILTER (WHERE status = 'qualified') AS qualified_leads,
  MIN(created_at) AS first_lead,
  MAX(created_at) AS last_lead
FROM leads
GROUP BY utm_source, utm_campaign
ORDER BY total_leads DESC;

-- Event funnel by campaign
CREATE OR REPLACE VIEW event_funnel AS
SELECT
  COALESCE(utm_source, 'direct') AS source,
  COALESCE(utm_campaign, 'none') AS campaign,
  COUNT(*) FILTER (WHERE event_type = 'page_view')      AS page_views,
  COUNT(*) FILTER (WHERE event_type = 'scroll_depth')    AS scroll_events,
  COUNT(*) FILTER (WHERE event_type = 'whatsapp_click')  AS whatsapp_clicks,
  COUNT(*) FILTER (WHERE event_type = 'form_submit')     AS form_submits,
  COUNT(*) FILTER (WHERE event_type = 'phone_click')     AS phone_clicks,
  COUNT(DISTINCT visitor_id)                              AS unique_visitors
FROM events
GROUP BY utm_source, utm_campaign
ORDER BY page_views DESC;

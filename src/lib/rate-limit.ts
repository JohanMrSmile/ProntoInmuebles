/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Note: In a serverless environment (like Vercel), this works per-instance.
 * For a distributed environment, use Redis (e.g. Upstash).
 */

type RateLimitInfo = {
  count: number;
  resetTime: number;
};

// Global map to hold rate limits
const limits = new Map<string, RateLimitInfo>();

export function rateLimit(
  key: string,
  limit: number = 60,
  windowMs: number = 60000
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  let info = limits.get(key);

  if (!info || now > info.resetTime) {
    info = { count: 0, resetTime: now + windowMs };
  }

  info.count++;
  limits.set(key, info);

  // Simple cleanup: periodically remove expired keys if map gets too large
  if (limits.size > 10000) {
    cleanRateLimits();
  }

  return {
    success: info.count <= limit,
    limit,
    remaining: Math.max(0, limit - info.count),
    reset: info.resetTime,
  };
}

export function cleanRateLimits() {
  const now = Date.now();
  limits.forEach((info, key) => {
    if (now > info.resetTime) {
      limits.delete(key);
    }
  });
}

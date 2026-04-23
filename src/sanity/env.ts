export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-23'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing-project-id'

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn('\n⚠️ [Sanity] Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID')
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.warn('⚠️ [Sanity] Missing environment variable: NEXT_PUBLIC_SANITY_DATASET. Usando fallback "production".\n')
}

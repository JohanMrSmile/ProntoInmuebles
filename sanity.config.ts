'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

import {DashboardTool} from './src/sanity/tools/DashboardTool'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  tools: (prev) => [
    {
      name: 'dashboard',
      title: '📊 Overview',
      component: DashboardTool,
    },
    ...prev,
  ],
  document: {
    actions: (prev) => {
      return prev.map((originalAction) => {
        if (originalAction.action === 'publish') {
          return (props) => {
            const originalResult = originalAction(props)
            if (!originalResult) return null
            return {
              ...originalResult,
              tone: 'positive',
              label: '🚀 PUBLICAR INMUEBLE',
            }
          }
        }
        return originalAction
      })
    }
  },
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})

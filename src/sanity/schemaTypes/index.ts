import { type SchemaTypeDefinition } from 'sanity'
import property from './property'
import { mapLocation } from './mapLocation'
import siteSettings from './siteSettings'
import review from './review'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property, mapLocation, siteSettings, review],
}

import { type SchemaTypeDefinition } from 'sanity'
import property from './property'
import { mapLocation } from './mapLocation'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property, mapLocation],
}

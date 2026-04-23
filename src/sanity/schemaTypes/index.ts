import { type SchemaTypeDefinition } from 'sanity'
import property from './property'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property],
}

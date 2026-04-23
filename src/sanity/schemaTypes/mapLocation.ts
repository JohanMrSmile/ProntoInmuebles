import { defineType, defineField } from 'sanity'
import { MapInput } from '../components/MapInput'

export const mapLocation = defineType({
  name: 'mapLocation',
  title: 'Ubicación en Mapa',
  type: 'object',
  components: {
    input: MapInput
  },
  fields: [
    defineField({ name: 'lat', type: 'number' }),
    defineField({ name: 'lng', type: 'number' })
  ]
})

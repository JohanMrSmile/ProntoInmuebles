import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'property',
  title: 'Propiedad',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().min(5).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Precio (texto)',
      type: 'string',
      description: 'Ej: $1.950.000.000 o $5.200.000 / mes',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceValue',
      title: 'Precio numérico',
      type: 'number',
      description: 'Solo el número, sin puntos ni signos. Se usa para filtros.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Imagen Principal',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Imágenes',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'propertyType',
      title: 'Tipo de Propiedad',
      type: 'string',
      options: {
        list: [
          { title: 'Apartamento', value: 'Apartamento' },
          { title: 'Apartaestudio', value: 'Apartaestudio' },
          { title: 'Casa', value: 'Casa' },
          { title: 'Local', value: 'Local' },
          { title: 'Bodega', value: 'Bodega' },
          { title: 'Loft', value: 'Loft' },
          { title: 'Estudio', value: 'Estudio' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'transactionType',
      title: 'Tipo de Negocio',
      type: 'string',
      options: {
        list: [
          { title: 'Venta', value: 'Venta' },
          { title: 'Arriendo', value: 'Arriendo' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bedrooms',
      title: 'Habitaciones',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(20),
    }),
    defineField({
      name: 'bathrooms',
      title: 'Baños',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(20),
    }),
    defineField({
      name: 'area',
      title: 'Área (m²)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: 'lat',
      title: 'Latitud',
      type: 'number',
      description: 'Coordenada para el mapa. Ej: 10.3956',
    }),
    defineField({
      name: 'lng',
      title: 'Longitud',
      type: 'number',
      description: 'Coordenada para el mapa. Ej: -75.5234',
    }),
    defineField({
      name: 'featured',
      title: 'Destacada',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'image',
    },
  },
})

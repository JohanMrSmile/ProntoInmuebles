import { defineField, defineType } from 'sanity'
import { PropertyPreview } from '../components/PropertyPreview'
import { VisualChipInput } from '../components/VisualChipInput'

export default defineType({
  name: 'property',
  title: '🏠 Inmueble',
  type: 'document',
  groups: [
    { name: 'general', title: '📋 Info Básica', default: true },
    { name: 'media', title: '📸 Fotos' },
    { name: 'location', title: '📍 Ubicación' },
    { name: 'details', title: '✨ Características' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título del Inmueble',
      type: 'string',
      group: 'general',
      description: 'Un título llamativo. Ej: Espectacular Apartamento Frente al Mar',
      validation: (Rule) => Rule.required().min(5).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Enlace Web (Slug)',
      type: 'slug',
      group: 'general',
      description: '👉 IMPORTANTE: Presiona "Generate" para crear el enlace web. Sin esto, el inmueble no aparecerá en la página.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'transactionType',
      title: 'Tipo de Negocio',
      type: 'string',
      group: 'general',
      components: {
        input: VisualChipInput
      },
      options: {
        list: [
          { title: 'Venta', value: 'Venta' },
          { title: 'Arriendo', value: 'Arriendo' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'propertyType',
      title: 'Tipo de Inmueble',
      type: 'string',
      group: 'general',
      components: {
        input: VisualChipInput
      },
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
      name: 'price',
      title: 'Precio (Texto visual)',
      type: 'string',
      group: 'general',
      description: 'El precio exactamente como quieres que lo vea el cliente. Ej: $1.950.000.000',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceValue',
      title: 'Precio (Valor numérico interno)',
      type: 'number',
      group: 'general',
      description: '⚠️ Escribe SOLO NÚMEROS (sin puntos ni símbolos). El sistema usa esto para que funcionen los filtros de precios.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Foto Principal',
      type: 'image',
      group: 'media',
      description: 'Esta es la cara del inmueble. Aparecerá en la tarjeta principal. Se recomienda formato horizontal y buena iluminación.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería Adicional',
      type: 'array',
      group: 'media',
      description: 'Sube aquí el resto de fotos (habitaciones, baños, zonas comunes).',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'location',
      title: 'Sector / Barrio',
      type: 'string',
      group: 'location',
      description: 'Texto corto para mostrar. Ej: Bocagrande, Cartagena',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mapLocation',
      title: 'Ubicación Exacta en el Mapa',
      type: 'mapLocation',
      group: 'location',
      description: 'Busca en el mapa y haz clic para soltar el pin exactamente donde está el inmueble.',
    }),
    defineField({
      name: 'bedrooms',
      title: 'Cantidad de Habitaciones',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required().min(0).max(20),
    }),
    defineField({
      name: 'bathrooms',
      title: 'Cantidad de Baños',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required().min(0).max(20),
    }),
    defineField({
      name: 'area',
      title: 'Área Total (m²)',
      type: 'number',
      group: 'details',
      description: 'Metros cuadrados del inmueble.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Descripción Detallada',
      type: 'text',
      group: 'details',
      description: 'Enamora al cliente. Cuenta los beneficios, acabados y detalles únicos del inmueble.',
      rows: 6,
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: 'featured',
      title: '🌟 Destacar Inmueble',
      type: 'boolean',
      group: 'details',
      description: 'Si activas esto, el inmueble aparecerá de primero en la página principal con una etiqueta especial.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'image',
      price: 'price',
      transactionType: 'transactionType',
      propertyType: 'propertyType',
      beds: 'bedrooms',
      baths: 'bathrooms'
    },
    prepare(selection) {
      return selection
    },
    components: {
      preview: PropertyPreview as any
    }
  },
})

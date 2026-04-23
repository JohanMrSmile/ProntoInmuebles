import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'review',
  title: '⭐ Testimonios',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Nombre del Cliente',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Reseña / Comentario',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(500),
    }),
    defineField({
      name: 'rating',
      title: 'Calificación',
      type: 'number',
      initialValue: 5,
      options: {
        list: [
          { title: '⭐⭐⭐⭐⭐ (5)', value: 5 },
          { title: '⭐⭐⭐⭐ (4)', value: 4 },
          { title: '⭐⭐⭐ (3)', value: 3 },
          { title: '⭐⭐ (2)', value: 2 },
          { title: '⭐ (1)', value: 1 },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Foto del Cliente (Opcional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Si el cliente lo permite, sube una foto de ellos. Esto aumenta muchísimo la confianza.',
    }),
  ],
  preview: {
    select: {
      title: 'author',
      subtitle: 'text',
      media: 'image',
      rating: 'rating',
    },
    prepare({ title, subtitle, media, rating }) {
      return {
        title: `${title} (${rating}⭐)`,
        subtitle: subtitle,
        media,
      }
    }
  },
})

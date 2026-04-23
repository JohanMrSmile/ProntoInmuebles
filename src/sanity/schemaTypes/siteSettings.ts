import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: '⚙️ Configuración Global',
  type: 'document',
  groups: [
    { name: 'branding', title: '🎨 Marca y SEO', default: true },
    { name: 'contact', title: '📞 Contacto Global' },
    { name: 'social', title: '🌐 Redes Sociales' },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nombre Oficial de la Empresa',
      type: 'string',
      group: 'branding',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo Principal',
      type: 'image',
      group: 'branding',
      options: { hotspot: true },
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descripción para Google (SEO)',
      type: 'text',
      rows: 3,
      group: 'branding',
      description: 'Breve descripción de la agencia. Aparecerá en los resultados de búsqueda.',
    }),
    defineField({
      name: 'mainWhatsApp',
      title: 'WhatsApp Principal',
      type: 'string',
      group: 'contact',
      description: 'Ej: 573001234567',
    }),
    defineField({
      name: 'mainEmail',
      title: 'Correo Principal',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Dirección de la Oficina',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'instagram',
      title: 'Enlace de Instagram',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'facebook',
      title: 'Enlace de Facebook',
      type: 'url',
      group: 'social',
    }),
  ],
})

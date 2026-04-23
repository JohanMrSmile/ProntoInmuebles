import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('ProntoHogar Admin')
    .items([
      S.listItem()
        .title('📍 Gestión Inmobiliaria')
        .child(
          S.list()
            .title('Gestión Inmobiliaria')
            .items([
              S.documentTypeListItem('property').title('🏠 Publicar Inmueble'),
            ])
        ),
      S.listItem()
        .title('⭐ Reseñas de Clientes')
        .child(
          S.list()
            .title('Reseñas')
            .items([
              S.documentTypeListItem('review').title('⭐ Publicar Reseña'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('⚙️ Configuración Global')
        .child(
          S.document()
            .title('Ajustes del Sitio')
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
    ])

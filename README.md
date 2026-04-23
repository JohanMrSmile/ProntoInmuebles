# ProntoHogar - Inmobiliaria + Servicios para el Hogar

## Arquitectura del Proyecto

```
prontohogar/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Layout principal
│   │   ├── propiedades/        # Sección propiedades
│   │   ├── servicios/          # Servicios para el hogar
│   │   └── contacto/           # Formulario de contacto
│   ├── components/
│   │   ├── Hero/               # Sección hero
│   │   ├── Services/           # Servicios principales
│   │   ├── Benefits/           # Beneficios
│   │   ├── Gallery/            # Galería de proyectos
│   │   ├── Testimonials/       # Testimonios
│   │   ├── CTA/                # Llamados a la acción
│   │   ├── Contact/            # Formulario de contacto
│   │   ├── Footer/             # Pie de página
│   │   └── ui/                  # Componentes reutilizables
│   ├── lib/
│   │   ├── supabase.ts         # Cliente Supabase
│   │   └── whatsapp.ts         # Utilidades WhatsApp
│   └── styles/
│       └── globals.css         # Estilos globales
├── public/
│   ├── images/                 # Imágenes optimizadas
│   └── icons/                  # Iconos SVG
└── package.json
```

## Stack Tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Forms:** React Hook Form + Zod
- **Deployment:** Vercel

## Características Principales

- SEO optimizado con metadatos dinámicos
- WhatsApp Business API integrado
- Formularios con validación
- Animaciones suaves
- Responsive design
- Preparado para CRM y automatizaciones

## Comandos

```bash
npm install
npm run dev
npm run build
npm start
```
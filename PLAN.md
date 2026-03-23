# Plan de Construccion — Catalogo Web Muebles Fercho

## Vision del Producto

Catalogo web premium para empresa de fabricacion y venta de muebles (madera, melamina, MDF y similares). El objetivo es que funcione como herramienta de ventas profesional: el cliente navega, elige, y contacta por WhatsApp con un mensaje pre-armado. El dueno administra todo desde un panel simple sin conocimientos tecnicos.

---

## Stack Tecnologico

| Capa | Tecnologia | Razon |
|---|---|---|
| Frontend + Backend | Next.js 14 (App Router) | Todo en un proyecto, SSR/SSG para velocidad y SEO |
| Lenguaje | TypeScript | Evita errores, mejor autocompletado |
| Estilos | Tailwind CSS + shadcn/ui | Velocidad de desarrollo, look profesional |
| Animaciones | Framer Motion | Sensacion premium en hover y transiciones |
| Editor de texto | Tiptap | Editor enriquecido para descripciones de productos |
| ORM | Prisma | Base de datos tipada, migraciones simples |
| Base de datos | PostgreSQL via Supabase | Gratis, robusto, ideal para variantes de precio |
| Imagenes | Cloudinary | Subida drag-and-drop, CDN global, optimizacion automatica |
| Autenticacion | NextAuth.js | Login simple para el admin |
| Analytics | Google Analytics 4 | Metricas de visitas y productos mas vistos |
| Deploy | Vercel | Un clic, HTTPS automatico, dominio gratis |

**Costo inicial: $0** — todos tienen tier gratuito suficiente para produccion inicial.

---

## Estructura de Carpetas

```
WebMueblesFercho/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── og-image.jpg
│
├── src/
│   ├── app/
│   │   ├── (catalog)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                          # Homepage
│   │   │   ├── catalogo/
│   │   │   │   └── page.tsx                      # Todos los productos con filtros
│   │   │   ├── categoria/
│   │   │   │   └── [slug]/page.tsx               # Productos por categoria
│   │   │   ├── producto/
│   │   │   │   └── [slug]/page.tsx               # Detalle de producto
│   │   │   ├── nosotros/
│   │   │   │   └── page.tsx
│   │   │   ├── como-trabajamos/
│   │   │   │   └── page.tsx
│   │   │   ├── galeria/
│   │   │   │   └── page.tsx                      # Trabajos terminados
│   │   │   ├── faq/
│   │   │   │   └── page.tsx
│   │   │   └── contacto/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx                      # Dashboard
│   │   │       ├── productos/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── nuevo/page.tsx
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx
│   │   │       │       └── variantes/page.tsx
│   │   │       ├── categorias/
│   │   │       │   ├── page.tsx
│   │   │       │   └── nueva/page.tsx
│   │   │       ├── materiales/page.tsx
│   │   │       ├── medidas/page.tsx
│   │   │       ├── galeria/page.tsx              # Fotos de trabajos terminados
│   │   │       ├── testimonios/page.tsx
│   │   │       ├── faq/page.tsx
│   │   │       ├── sets/page.tsx                 # Agrupar productos en sets
│   │   │       └── configuracion/page.tsx        # Banner promo, datos de contacto
│   │   │
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── productos/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── categorias/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── variantes/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── materiales/route.ts
│   │   │   ├── medidas/route.ts
│   │   │   ├── galeria/route.ts
│   │   │   ├── testimonios/route.ts
│   │   │   ├── faq/route.ts
│   │   │   ├── sets/route.ts
│   │   │   ├── configuracion/route.ts
│   │   │   └── upload/route.ts                  # URL firmada para Cloudinary
│   │   │
│   │   └── login/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                                   # shadcn/ui (auto-generados)
│   │   │
│   │   ├── catalog/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx               # Carrusel + lightbox con zoom
│   │   │   ├── VariantSelector.tsx              # Selector material + medida
│   │   │   ├── PriceDisplay.tsx                 # Precio dinamico
│   │   │   ├── ProductComparator.tsx            # Comparar hasta 3 productos
│   │   │   ├── RelatedProducts.tsx
│   │   │   ├── ProductSet.tsx                   # Sets de productos relacionados
│   │   │   ├── SearchBar.tsx                    # Busqueda instantanea
│   │   │   ├── FilterSidebar.tsx               # Filtros: categoria, material, precio
│   │   │   ├── WhatsAppButton.tsx               # Boton flotante siempre visible
│   │   │   ├── PromoBanner.tsx                  # Banner de oferta editable desde admin
│   │   │   ├── TestimonialsCarousel.tsx
│   │   │   ├── GalleryGrid.tsx                  # Fotos de trabajos terminados
│   │   │   ├── HowWeWork.tsx
│   │   │   ├── FaqAccordion.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   └── QuoteRequestForm.tsx            # Solicitud de cotizacion personalizada
│   │   │
│   │   └── admin/
│   │       ├── AdminSidebar.tsx
│   │       ├── AdminTopBar.tsx
│   │       ├── DashboardStats.tsx
│   │       ├── ProductForm.tsx
│   │       ├── VariantPricingTable.tsx          # Tabla material x medida x precio
│   │       ├── CategoryForm.tsx
│   │       ├── ImageUploader.tsx                # Drag-and-drop, progreso, reorden
│   │       ├── RichTextEditor.tsx               # Tiptap para descripciones
│   │       ├── DataTable.tsx                    # Tabla reutilizable con sort/filter
│   │       ├── PriceHistoryLog.tsx              # Historial de cambios de precio
│   │       ├── ProductPreview.tsx               # Vista previa antes de publicar
│   │       ├── AlertsPanel.tsx                  # Alertas: sin imagen, sin variantes
│   │       ├── CatalogPdfExport.tsx             # Exportar catalogo en PDF
│   │       └── ConfirmDialog.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── cloudinary.ts
│   │   ├── auth.ts
│   │   ├── whatsapp.ts                          # Genera URL de mensaje pre-armado
│   │   ├── pdf.ts                               # Generacion de PDF del catalogo
│   │   ├── analytics.ts                         # Helpers de GA4
│   │   ├── utils.ts                             # cn(), formatPrice(), slugify()
│   │   └── validations.ts
│   │
│   ├── hooks/
│   │   ├── useVariantPrice.ts
│   │   ├── useSearch.ts
│   │   ├── useDebounce.ts
│   │   └── useComparator.ts
│   │
│   └── types/
│       └── index.ts
│
├── .env.local                                   # NUNCA subir a GitHub
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Schema de Base de Datos (Prisma)

```prisma
model Category {
  id          Int       @id @default(autoincrement())
  name        String
  slug        String    @unique
  description String?
  imageUrl    String?
  imagePublicId String?
  order       Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  products    Product[]
  sets        ProductSet[]
}

model Product {
  id            Int            @id @default(autoincrement())
  name          String
  slug          String         @unique
  description   String?        // HTML desde Tiptap
  categoryId    Int
  category      Category       @relation(fields: [categoryId], references: [id])
  images        ProductImage[]
  variants      Variant[]
  sets          ProductSetItem[]
  isFeatured    Boolean        @default(false)
  isActive      Boolean        @default(true)
  warrantyMonths Int?          // Meses de garantia
  productionDays Int?          // Dias estimados de fabricacion
  order         Int            @default(0)
  viewCount     Int            @default(0)  // Para ranking de mas vistos
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model ProductImage {
  id         Int     @id @default(autoincrement())
  productId  Int
  product    Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url        String
  publicId   String  // Cloudinary public_id
  altText    String?
  order      Int     @default(0)
  isPrimary  Boolean @default(false)
}

model Material {
  id       Int       @id @default(autoincrement())
  name     String    @unique   // "Madera Maciza", "MDF", "Melamina", etc.
  variants Variant[]
}

model Measurement {
  id          Int       @id @default(autoincrement())
  label       String    @unique   // "120x60x75 cm", "Matrimonial", etc.
  description String?
  variants    Variant[]
}

model Variant {
  id            Int           @id @default(autoincrement())
  productId     Int
  product       Product       @relation(fields: [productId], references: [id], onDelete: Cascade)
  materialId    Int?
  material      Material?     @relation(fields: [materialId], references: [id])
  measurementId Int?
  measurement   Measurement?  @relation(fields: [measurementId], references: [id])
  price         Decimal       @db.Decimal(10, 2)
  sku           String?       @unique
  stock         Int?
  isActive      Boolean       @default(true)
  priceHistory  PriceHistory[]

  @@unique([productId, materialId, measurementId])
}

model PriceHistory {
  id        Int      @id @default(autoincrement())
  variantId Int
  variant   Variant  @relation(fields: [variantId], references: [id], onDelete: Cascade)
  oldPrice  Decimal  @db.Decimal(10, 2)
  newPrice  Decimal  @db.Decimal(10, 2)
  changedAt DateTime @default(now())
}

model ProductSet {
  id         Int            @id @default(autoincrement())
  name       String         // "Dormitorio Completo", "Comedor 6 personas"
  slug       String         @unique
  description String?
  categoryId Int?
  category   Category?      @relation(fields: [categoryId], references: [id])
  imageUrl   String?
  imagePublicId String?
  isActive   Boolean        @default(true)
  items      ProductSetItem[]
}

model ProductSetItem {
  id         Int        @id @default(autoincrement())
  setId      Int
  set        ProductSet @relation(fields: [setId], references: [id], onDelete: Cascade)
  productId  Int
  product    Product    @relation(fields: [productId], references: [id])
  quantity   Int        @default(1)
}

model GalleryPhoto {
  id          Int      @id @default(autoincrement())
  url         String
  publicId    String
  title       String?
  description String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Testimonial {
  id         Int      @id @default(autoincrement())
  clientName String
  text       String
  rating     Int      @default(5)  // 1 a 5
  photoUrl   String?
  photoPublicId String?
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
}

model Faq {
  id        Int     @id @default(autoincrement())
  question  String
  answer    String
  order     Int     @default(0)
  isActive  Boolean @default(true)
}

model SiteConfig {
  id              Int      @id @default(1)  // Siempre un solo registro
  businessName    String   @default("Muebles Fercho")
  phone           String?
  whatsapp        String?
  email           String?
  address         String?
  instagram       String?
  facebook        String?
  tiktok          String?
  promoBannerText String?  // Null = banner oculto
  promoBannerActive Boolean @default(false)
  updatedAt       DateTime @updatedAt
}

model AdminUser {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String?
  createdAt DateTime @default(now())
}
```

---

## Paginas del Catalogo Publico

| Ruta | Descripcion |
|---|---|
| `/` | Home: hero, categorias, productos destacados, como trabajamos, testimonios |
| `/catalogo` | Todos los productos con filtros y ordenamiento |
| `/categoria/[slug]` | Productos de una categoria |
| `/producto/[slug]` | Detalle: galeria con zoom, selector variante, precio dinamico, WhatsApp |
| `/nosotros` | Historia, fotos del taller, equipo |
| `/como-trabajamos` | Pasos: Cotizas → Disenamos → Fabricamos → Entregamos |
| `/galeria` | Fotos de trabajos terminados en casas de clientes |
| `/faq` | Preguntas frecuentes |
| `/contacto` | Formulario de contacto + solicitud de cotizacion personalizada |
| `/login` | Login del admin (oculto del menu publico) |

---

## Panel de Administracion

| Seccion | Funcionalidad |
|---|---|
| Dashboard | Metricas: total productos, productos activos, alertas (sin imagen, sin variante), productos mas vistos |
| Productos | Lista con busqueda, sort, toggle activo/destacado, vista previa |
| Nuevo/Editar Producto | Nombre, slug, descripcion (rich text), categoria, garantia, dias fabricacion, imagenes (drag-and-drop, reorden), activar/destacar |
| Variantes | Tabla material x medida x precio. Agregar, editar precio inline, ver historial de precios |
| Categorias | CRUD con imagen y reorden drag-and-drop |
| Materiales | Lista simple CRUD |
| Medidas | Lista simple CRUD |
| Sets de Productos | Agrupar productos que van bien juntos, mostrar como sugerencia en detalle |
| Galeria | Subir fotos de trabajos terminados |
| Testimonios | CRUD de resenas de clientes con foto y rating |
| FAQ | CRUD de preguntas frecuentes con reorden |
| Configuracion | Datos de contacto, redes sociales, banner de promocion (activar/desactivar con texto) |
| Exportar PDF | Generar PDF del catalogo completo o por categoria |

---

## Features Clave del Catalogo

### WhatsApp (conversion principal)
- Boton flotante en todas las paginas del catalogo
- En la pagina de producto, el mensaje incluye: nombre del producto, material seleccionado, medida seleccionada, precio
- Formato: *"Hola! Me interesa [Producto] en [Material] - [Medida] ($X,XXX). Quisiera mas informacion."*

### Selector de Variantes con Precio Dinamico
- Primero se elige el material (botones)
- Luego se elige la medida (botones, solo muestra las disponibles para ese material)
- El precio actualiza en tiempo real sin recargar la pagina

### Buscador Instantaneo
- Barra de busqueda en el navbar
- Resultados aparecen mientras se escribe (debounce 300ms)
- Busca en nombre de producto y categoria

### Filtros en el Catalogo
- Por categoria (checkboxes)
- Por material (checkboxes)
- Por rango de precio (slider)
- Ordenamiento: destacados, mas nuevos, precio menor/mayor
- Los filtros se guardan en la URL (shareables/bookmarkables)

### Comparador de Productos
- Boton "Comparar" en cada card del catalogo
- Se pueden seleccionar hasta 3 productos
- Panel fijo en la parte inferior muestra los seleccionados
- Pagina de comparacion lado a lado: imagen, nombre, categoria, materiales, medidas, precios

### Galeria con Zoom y Lightbox
- Carrusel de imagenes en la pagina de producto
- Click abre lightbox a pantalla completa
- Zoom en la imagen del lightbox

### Sets / "Completa tu habitacion"
- Seccion en la pagina de detalle: "Productos que combinan con este"
- Los sets son configurados por el admin

### Banner de Promocion
- El admin activa/desactiva un banner en la parte superior del sitio
- Texto editable desde la configuracion del admin
- Ejemplo: "Enero: 15% de descuento en comedores — Consultar por WhatsApp"

---

## API REST

```
# Productos
GET    /api/productos              ?categoria= &search= &material= &precioMin= &precioMax= &page=
POST   /api/productos
GET    /api/productos/[id]
PUT    /api/productos/[id]
DELETE /api/productos/[id]

# Categorias
GET    /api/categorias
POST   /api/categorias
PUT    /api/categorias/[id]
DELETE /api/categorias/[id]

# Variantes
GET    /api/variantes?productoId=
POST   /api/variantes
PUT    /api/variantes/[id]
DELETE /api/variantes/[id]

# Materiales y Medidas
GET/POST/DELETE /api/materiales
GET/POST/DELETE /api/medidas

# Contenido
GET/POST/PUT/DELETE /api/galeria
GET/POST/PUT/DELETE /api/testimonios
GET/POST/PUT/DELETE /api/faq
GET/POST/PUT/DELETE /api/sets

# Configuracion
GET/PUT /api/configuracion

# Upload
POST /api/upload    # Retorna URL firmada de Cloudinary
```

**Estrategia de datos:**
- Paginas publicas: ISR con `revalidate` (se regeneran automaticamente al cambiar contenido)
- Panel admin: fetch fresco en cada request, sin cache

---

## SEO

- Metadata automatica por producto (title, description, og:image)
- Sitemap.xml generado automaticamente con todas las rutas
- Schema.org `Product` en cada pagina de producto (Google muestra precio e imagen en resultados)
- URLs limpias: `/producto/cama-matrimonial-madera-maciza`
- Open Graph: al compartir en WhatsApp/Facebook aparece foto + nombre + precio

---

## Diseno Visual

### Paleta de Colores
```
Primary:    #1C1C1E  (negro sofisticado)
Secondary:  #8B7355  (marron nogal)
Accent:     #C9A96E  (dorado antiguo)
Background: #FAF9F7  (blanco calido)
Text:       #2C2C2C
Muted:      #7A7A7A
```

### Tipografia
- Titulos: `Playfair Display` (serif elegante, Google Fonts)
- Cuerpo: `Inter` (moderna, legible)

### Principios visuales
- Espacios generosos (padding amplio, nada apretado)
- Sombras suaves (nunca duras)
- Bordes redondeados: `8px` cards, `4px` inputs
- Imagenes siempre en aspecto ratio fijo (4:3 o 1:1)
- Transiciones: `200-300ms ease`
- Hover en cards: leve zoom en imagen + elevacion de sombra

---

## Variables de Entorno

```env
# .env.local — NUNCA subir a GitHub

# Base de datos (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="cadena-aleatoria-de-32-caracteres"
NEXTAUTH_URL="https://tudominio.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""

# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# WhatsApp (numero sin +, sin espacios, con codigo de pais)
NEXT_PUBLIC_WHATSAPP_NUMBER="5491112345678"
```

---

## Servicios de Terceros

| Servicio | Uso | Costo |
|---|---|---|
| Supabase | PostgreSQL hosting | Gratis (500MB) |
| Cloudinary | Imagenes, optimizacion, CDN | Gratis (25GB storage) |
| Vercel | Hosting y deploy | Gratis |
| Google Fonts | Playfair Display + Inter | Gratis |
| Google Analytics 4 | Metricas de visitas | Gratis |
| WhatsApp Business | Canal de ventas | Gratis |

---

## Fases de Construccion

### Fase 1 — Fundacion
- Scaffold Next.js 14 con TypeScript + Tailwind + shadcn/ui
- Schema de Prisma completo + migracion en Supabase
- NextAuth con primer usuario admin (seed)
- Integracion Cloudinary

### Fase 2 — Panel Admin
- Layout admin (sidebar + topbar)
- CRUD Categorias con imagen
- CRUD Materiales y Medidas
- CRUD Productos con imagen drag-and-drop y rich text
- Tabla de variantes (material x medida x precio) con historial
- CRUD Galeria, Testimonios, FAQ
- Configuracion del sitio (contacto, redes, banner promo)
- Dashboard con alertas y metricas
- Exportacion PDF

### Fase 3 — Catalogo Publico
- Layout publico (navbar, footer, boton WhatsApp flotante)
- Homepage: hero, categorias, destacados, como trabajamos, testimonios
- Catalogo con filtros avanzados y buscador instantaneo
- Pagina por categoria
- Pagina de detalle: galeria con zoom, selector variante, precio dinamico, boton WhatsApp con mensaje pre-armado, sets relacionados
- Comparador de productos
- Paginas: Nosotros, Como trabajamos, Galeria, FAQ, Contacto + Cotizacion
- Banner de promocion

### Fase 4 — Pulido y Deploy
- SEO: metadata, sitemap, Schema.org
- Open Graph para compartir en redes
- PWA (manifest + service worker basico)
- Framer Motion: transiciones de pagina, hover en cards, animaciones de entrada
- Auditoria responsive (mobile first)
- Auditoria Lighthouse (performance, SEO, accesibilidad)
- Google Analytics 4
- Seed de datos de ejemplo
- Deploy en Vercel con dominio personalizado

---

## Decisiones de Arquitectura Clave

1. **Variante = Material + Medida + Precio**: ambos campos son opcionales en la variante, permitiendo productos con solo material, solo medida, o ambos. La restriccion `@@unique` en Prisma previene duplicados a nivel de base de datos.

2. **Cloudinary directo desde el cliente**: el servidor genera una URL firmada y el cliente sube directo a Cloudinary. El archivo nunca pasa por el servidor de Next.js, evitando timeouts y carga en el servidor.

3. **ISR para el catalogo publico**: las paginas de productos y categorias se generan estaticamente y se revalidan automaticamente. Esto da velocidad de sitio estatico con datos siempre actualizados.

4. **Prisma singleton**: el cliente de Prisma se inicializa una sola vez para evitar agotamiento del pool de conexiones en entorno serverless de Vercel.

5. **SiteConfig unico**: la tabla `SiteConfig` siempre tiene un solo registro (id=1). Es mas simple que multiples registros de configuracion y el admin solo ve un formulario de configuracion general.

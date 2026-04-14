export interface CategoryWithCount {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  order: number;
  isActive: boolean;
  _count: { products: number };
}

export interface ProductImage {
  id: number;
  url: string;
  publicId: string;
  altText: string | null;
  order: number;
  isPrimary: boolean;
}

export interface MaterialOption {
  id: number;
  name: string;
}

export interface MeasurementOption {
  id: number;
  label: string;
  description: string | null;
}

export interface VariantWithDetails {
  id: number;
  price: number;
  sku: string | null;
  stock: number | null;
  isActive: boolean;
  material: MaterialOption | null;
  measurement: MeasurementOption | null;
}

export interface ProductCard {
  id: number;
  name: string;
  slug: string;
  isFeatured: boolean;
  isActive: boolean;
  category: { id: number; name: string; slug: string };
  images: ProductImage[];
  variants: VariantWithDetails[];
}

export interface ProductDetail extends ProductCard {
  description: string | null;
  warrantyMonths: number | null;
  productionDays: number | null;
  retailPrice: number | null;
  wholesalePrice: number | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteConfigData {
  id: number;
  businessName: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  promoBannerText: string | null;
  promoBannerActive: boolean;
}

export interface GalleryPhotoData {
  id: number;
  url: string;
  publicId: string;
  title: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
}

export interface TestimonialData {
  id: number;
  clientName: string;
  text: string;
  rating: number;
  photoUrl: string | null;
  isActive: boolean;
}

export interface FaqData {
  id: number;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

// NextAuth session extension
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}

import { getMediaUrl } from '../utils/media';
import {
  DjangoProduct,
  Product,
  DjangoCategory,
  DjangoBrand,
  Brand,
  DjangoArticle,
  Article,
} from '../types';

/**
 * Maps Django REST API Product object to UI Product interface
 */
export function mapDjangoProductToUI(item: DjangoProduct): Product {
  return {
    id: String(item.id),
    slug: item.slug,
    name: item.name,
    brand: item.brand?.name || item.brand?.persian_name || '',
    category: item.category?.name || '',
    image: getMediaUrl(item.image_url),
    galleryImages: (item.gallery_images || []).map(getMediaUrl).filter(Boolean),
    price: item.price,
    originalPrice: item.original_price,
    discountPercentage: item.discount_percentage,
    rating: item.rating,
    ratingCount: item.rating_count,
    isNew: item.is_new,
    isPopular: item.is_popular,
    isGoldenOffer: item.is_golden_offer,
    badge: item.badge,
    bgGlowColor: item.bg_glow_color,
    description: item.description,
    shortDescription: item.short_description,
    usageInstructions: item.usage_instructions,
    ingredients: item.ingredients,
    attributes: item.attributes,
    stockQuantity: item.stock_quantity,
    salesCount: item.sales_count,
    inStock: item.in_stock,
    volumeOrSize: item.volume_or_size,
    sku: item.sku,
    barcode: item.barcode,
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    canonicalUrl: item.canonical_url,
    ogImage: getMediaUrl(item.og_image),
    metaKeywords: item.meta_keywords,
    schemaJson: item.schema_json,
  };
}

/**
 * Maps Django REST API Brand object to UI Brand interface
 */
export function mapDjangoBrandToUI(item: DjangoBrand): Brand {
  return {
    id: String(item.id),
    slug: item.slug,
    name: item.name,
    persianName: item.persian_name || item.name,
    logo: getMediaUrl(item.logo_url),
    description: item.description,
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    canonicalUrl: item.canonical_url,
    ogImage: getMediaUrl(item.og_image),
  };
}

/**
 * Maps Django REST API Article object to UI Article interface
 */
export function mapDjangoArticleToUI(item: DjangoArticle): Article {
  return {
    id: String(item.id),
    title: item.title,
    summary: item.summary,
    content: item.content,
    image: getMediaUrl(item.image_url),
    category: item.category_name,
    date: item.published_at,
    readTime: item.read_time,
    authorName: item.author?.name,
    authorRole: item.author?.role,
    authorAvatar: getMediaUrl(item.author?.avatar_url),
    slug: item.slug,
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    canonicalUrl: item.canonical_url,
    ogImage: getMediaUrl(item.og_image),
    datePublished: item.published_at,
    dateModified: item.updated_at,
    metaKeywords: item.meta_keywords,
    schemaJson: item.schema_json,
  };
}

/**
 * Maps Django REST API Category object recursively
 */
export function mapDjangoCategoryToUI(cat: DjangoCategory): DjangoCategory {
  return {
    ...cat,
    image: getMediaUrl(cat.image),
    icon: getMediaUrl(cat.icon),
    og_image: getMediaUrl(cat.og_image),
    children: cat.children ? cat.children.map(mapDjangoCategoryToUI) : [],
  };
}

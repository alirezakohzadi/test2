import { apiClient } from './apiClient';
import {
  HomepageQuickAccessItem,
  HomepageProductGroup,
  HomepageProductSection,
  DjangoProduct,
} from '../types';
import { getMediaUrl } from '../utils/media';
import { mapDjangoProductToUI } from './dataMappers';
import { bannerService } from './bannerService';
import { categoryService } from './categoryService';
import { productService } from './productService';

export const homepageService = {
  /**
   * Fetch quick access items from Django API GET /homepage/quick-access/
   * Fallback: query banners with position 'quick_access' or top categories
   */
  async getQuickAccessItems(): Promise<HomepageQuickAccessItem[]> {
    try {
      const response = await apiClient.get<any[]>('/homepage/quick-access/');
      if (Array.isArray(response) && response.length > 0) {
        return response.map((item, idx) => ({
          id: item.id || idx,
          title: item.title || item.name || '',
          subtitle: item.subtitle || '',
          icon: getMediaUrl(item.icon),
          image: getMediaUrl(item.image || item.image_url),
          link: item.link || item.url || '',
          order: item.order ?? idx,
          is_active: item.is_active ?? true,
          badge: item.badge || item.badge_text || '',
        }));
      }
    } catch {
      // Endpoint pending on backend - fallback to banners with position 'quick_access' or categories
    }

    try {
      const banners = await bannerService.getBanners('quick_access');
      if (banners && banners.length > 0) {
        return banners.map((b, idx) => ({
          id: b.id || idx,
          title: b.title || '',
          subtitle: b.subtitle || '',
          image: getMediaUrl(b.image_url),
          link: b.link_url || '',
          order: b.order ?? idx,
          is_active: b.is_active ?? true,
          badge: b.badge_text || '',
        }));
      }
    } catch {
      // Banner fallback failed
    }

    // Try categories fallback
    try {
      const categories = await categoryService.getCategories();
      if (categories && categories.length > 0) {
        return categories.slice(0, 8).map((cat, idx) => ({
          id: cat.id || idx,
          title: cat.name || '',
          image: getMediaUrl(cat.icon || cat.image),
          link: `/shop?category=${cat.slug}`,
          order: (cat as any).order ?? idx,
          is_active: true,
        }));
      }
    } catch {
      // Category fallback failed
    }

    return [];
  },

  /**
   * Fetch product groups from Django API GET /homepage/product-groups/
   */
  async getProductGroups(): Promise<HomepageProductGroup[]> {
    try {
      const response = await apiClient.get<any[]>('/homepage/product-groups/');
      if (Array.isArray(response) && response.length > 0) {
        return response.map((grp, idx) => ({
          id: grp.id || idx,
          title: grp.title || grp.name || '',
          slug: grp.slug || '',
          description: grp.description || '',
          image: getMediaUrl(grp.image || grp.icon),
          order: grp.order ?? idx,
          is_active: grp.is_active ?? true,
          products: Array.isArray(grp.products)
            ? grp.products.map(mapDjangoProductToUI)
            : [],
        }));
      }
    } catch {
      // Endpoint pending on backend - fallback to dynamic top categories
    }

    try {
      const categories = await categoryService.getCategories();
      if (categories && categories.length > 0) {
        return categories.slice(0, 6).map((cat, idx) => ({
          id: cat.id || idx,
          title: cat.name || '',
          slug: cat.slug,
          description: cat.description || '',
          image: getMediaUrl(cat.image || cat.icon),
          order: (cat as any).order ?? idx,
          is_active: true,
          products: [],
        }));
      }
    } catch {
      // Category fallback failed
    }

    return [];
  },

  /**
   * Fetch custom dynamic product sections from Django API GET /homepage/product-sections/
   */
  async getProductSections(): Promise<HomepageProductSection[]> {
    try {
      const response = await apiClient.get<any[]>('/homepage/product-sections/');
      if (Array.isArray(response) && response.length > 0) {
        return response.map((sec, idx) => ({
          id: sec.id || idx,
          title: sec.title || '',
          slug: sec.slug || sec.type || sec.section_type || '',
          subtitle: sec.subtitle || '',
          badge: sec.badge || sec.badge_text || '',
          display_type: sec.display_type || 'carousel',
          order: sec.order ?? idx,
          is_active: sec.is_active ?? true,
          max_products: sec.max_products || sec.limit || 8,
          products: Array.isArray(sec.products)
            ? sec.products.map((p: DjangoProduct) => mapDjangoProductToUI(p))
            : [],
        }));
      }
    } catch {
      // Fallback handled in specific component callers if section API is missing
    }

    return [];
  },

  /**
   * Fetch specific section configuration and products by slug or section_type
   */
  async getSectionConfig(sectionType: string): Promise<HomepageProductSection | null> {
    try {
      // First try calling GET /homepage/product-sections/?type={sectionType} or /homepage/product-sections/{sectionType}/
      const response = await apiClient.get<any>(`/homepage/product-sections/`, { type: sectionType, slug: sectionType });
      if (Array.isArray(response) && response.length > 0) {
        const found = response.find(
          (s) => s.slug === sectionType || s.type === sectionType || s.section_type === sectionType
        ) || response[0];

        if (found) {
          return {
            id: found.id || 1,
            title: found.title || '',
            slug: found.slug || sectionType,
            subtitle: found.subtitle || '',
            badge: found.badge || found.badge_text || '',
            display_type: found.display_type || 'carousel',
            order: found.order ?? 0,
            is_active: found.is_active ?? true,
            max_products: found.max_products || found.limit || 8,
            products: Array.isArray(found.products)
              ? found.products.map((p: DjangoProduct) => mapDjangoProductToUI(p))
              : [],
          };
        }
      } else if (response && typeof response === 'object' && !Array.isArray(response) && response.title) {
        return {
          id: response.id || 1,
          title: response.title || '',
          slug: response.slug || sectionType,
          subtitle: response.subtitle || '',
          badge: response.badge || response.badge_text || '',
          display_type: response.display_type || 'carousel',
          order: response.order ?? 0,
          is_active: response.is_active ?? true,
          max_products: response.max_products || response.limit || 8,
          products: Array.isArray(response.products)
            ? response.products.map((p: DjangoProduct) => mapDjangoProductToUI(p))
            : [],
        };
      }
    } catch {
      // Endpoint missing or failed - proceed to standard endpoint fallbacks below
    }

    // Fallback based on sectionType
    const maxLimit = 8;
    try {
      let fallbackProducts = [];
      if (sectionType === 'highlights' || sectionType === 'featured') {
        fallbackProducts = await productService.getFeaturedProducts(maxLimit);
      } else if (sectionType === 'offers') {
        fallbackProducts = await productService.getFeaturedProducts(maxLimit);
      } else if (sectionType === 'new_arrivals') {
        fallbackProducts = await productService.getNewArrivals(maxLimit);
      } else if (sectionType === 'best_sellers') {
        fallbackProducts = await productService.getBestSellers(maxLimit);
      } else if (sectionType === 'most_popular') {
        const best = await productService.getBestSellers(4);
        fallbackProducts = best.slice(0, 4);
      }

      return {
        id: sectionType,
        title: '',
        slug: sectionType,
        is_active: true,
        max_products: maxLimit,
        products: fallbackProducts,
      };
    } catch (err) {
      throw err;
    }
  },
};

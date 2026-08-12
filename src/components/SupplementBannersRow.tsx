import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { bannerService } from '../services/bannerService';
import { DjangoBanner } from '../types';

interface SupplementBannersRowProps {
  onBannerClick?: (categorySlug: string) => void;
}

export const SupplementBannersRow: React.FC<SupplementBannersRowProps> = ({ onBannerClick }) => {
  const [banners, setBanners] = useState<DjangoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bannerService.getBanners('row');
      setBanners(data);
    } catch {
      setError('خطا در بارگذاری بنرهای ردیفی');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-2 my-2 bg-white animate-pulse">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-28 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && banners.length === 0) {
    return (
      <div className="w-full py-4 text-center">
        <p className="text-xs text-rose-500 mb-1">{error}</p>
        <button
          onClick={loadBanners}
          className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition inline-flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>تلاش مجدد</span>
        </button>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-2 my-2 bg-white">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              onClick={() => onBannerClick?.(banner.link_url || banner.title)}
              className="cursor-pointer"
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain block rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


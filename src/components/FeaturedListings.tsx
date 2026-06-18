import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fetchFeaturedSettings } from '../utils/api';
import type { FeaturedSetting } from '../types';

// Animation variants
const statsContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const statItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function FeaturedListings() {
  const [settings, setSettings] = useState<FeaturedSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const data = await fetchFeaturedSettings();

        // Ensure proper order: graceum_sale, graceum_jeonse, arteon_sale
        const orderMap: Record<string, number> = {
          'graceum_sale': 1,
          'graceum_jeonse': 2,
          'arteon_sale': 3
        };

        const sorted = data.sort((a, b) => (orderMap[a.id] || 99) - (orderMap[b.id] || 99));
        setSettings(sorted);
      } catch (err) {
        console.error('Failed to load featured settings:', err);
        setError('추천 매물을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            로딩 중...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            {error}
          </div>
        </div>
      </section>
    );
  }

  // Helper to determine badge type
  const getBadgeType = (id: string) => {
    if (id.includes('sale')) return '매매';
    if (id.includes('jeonse')) return '전세';
    return '';
  };

  // Helper to determine background style based on type
  const getCardStyle = (id: string) => {
    if (id.includes('sale')) return 'bg-sky-50 dark:bg-sky-900/10 border-sky-100 dark:border-sky-800/40';
    if (id.includes('jeonse')) return 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/40';
    return 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-800';
  };

  const getBadgeStyle = (id: string) => {
    if (id.includes('sale')) return 'bg-sky-600 text-white shadow-sky-500/30';
    if (id.includes('jeonse')) return 'bg-amber-500 text-white shadow-amber-500/30';
    return 'bg-primary text-navy-dark';
  };

  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12"
        >
          <div>
            <h2 className="text-primary font-bold tracking-widest text-sm mb-2">FEATURED LISTINGS</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-secondary dark:text-white">매물 시세</h3>
          </div>
        </motion.div>

        <motion.div
          variants={statsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {settings.map((item) => {
            const imageName = item.id.replace('_', '-');
            const cardStyle = getCardStyle(item.id);
            const badgeStyle = getBadgeStyle(item.id);

            return (
              <motion.div key={item.id} variants={statItem} className={`${cardStyle} rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border group flex flex-col`}>
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className={`${badgeStyle} text-sm font-bold px-3 py-1.5 rounded shadow-lg`}>{getBadgeType(item.id)}</span>
                  </div>
                  <img src={`/${imageName}.jpg`} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{item.title}</h4>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">

                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">25평</span>
                      <span className="text-xl font-bold text-secondary dark:text-white">{item.price_25}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">34평</span>
                      <span className="text-xl font-bold text-secondary dark:text-white">{item.price_34}</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button type="button" className="block w-full text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-colors py-3 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm cursor-default">
                      전화 연결 / 상담 예약
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-8 text-center md:hidden">
          <span className="inline-flex items-center text-primary hover:text-secondary dark:hover:text-white transition-colors font-medium group cursor-default">
            상담 전화 연결 <span className="material-symbols-outlined ml-1 transition-transform group-hover:translate-x-1">call</span>
          </span>
        </div>
      </div>
    </section>
  );
}

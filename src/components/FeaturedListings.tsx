import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fetchListings } from '../utils/api';
import type { Listing } from '../types';

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
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        const data = await fetchListings();
        setListings(data.slice(0, 3)); // Show only first 3 listings
      } catch (err) {
        console.error('Failed to load listings:', err);
        setError('매물을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    loadListings();
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
            <h3 className="text-3xl md:text-4xl font-display font-bold text-secondary dark:text-white">추천 매물</h3>
          </div>
          <a className="hidden md:flex items-center text-primary hover:text-secondary dark:hover:text-white transition-colors font-medium group mt-4 md:mt-0" href="tel:02-441-1110">
            전체 매물 보기 <span className="material-symbols-outlined ml-1 transition-transform group-hover:translate-x-1">arrow_forward</span>
          </a>
        </motion.div>

        <motion.div
          variants={statsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {listings.map((listing) => (
            <motion.div key={listing.id} variants={statItem} className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 group cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="bg-primary text-navy-dark text-xs font-bold px-3 py-1.5 rounded shadow-md">{listing.type}</span>
                </div>
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  {listing.tags.map((tag, idx) => (
                    <span key={idx} className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded border border-white/30">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className="text-2xl font-bold text-secondary dark:text-white mb-2">{listing.price}</div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{listing.title}</h4>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-primary">straighten</span>
                    <span>{listing.specs.size}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-primary">bed</span>
                    <span>방 {listing.specs.bed}개</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-primary">shower</span>
                    <span>욕실 {listing.specs.bath}개</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 text-center md:hidden">
          <a className="inline-flex items-center text-primary hover:text-secondary dark:hover:text-white transition-colors font-medium group" href="tel:02-441-1110">
            전체 매물 보기 <span className="material-symbols-outlined ml-1 transition-transform group-hover:translate-x-1">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
}

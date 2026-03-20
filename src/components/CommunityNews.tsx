import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { fetchNews, getFirstImage } from '../utils/api';
import type { NewsItem } from '../types';

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

// Category badge color mapping
const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case '뉴스':
      return 'bg-primary text-navy-dark';
    case '팁':
      return 'bg-secondary dark:bg-white text-white dark:text-secondary';
    default:
      return 'bg-gray-500 text-white';
  }
};

const stripHtml = (text: string) => {
  if (!text) return '';
  // 1. Remove style and script tags and their content first
  let cleaned = text.replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, ' ');
  // 2. Remove all other HTML tags
  cleaned = cleaned.replace(/<[^>]*>?/gm, ' ');
  // 3. Clean up whitespace
  return cleaned.replace(/\s+/g, ' ').trim();
};

export default function CommunityNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const data = await fetchNews();
        setNews(data.slice(0, 3)); // Show only first 3 news items
      } catch (err) {
        console.error('Failed to load news:', err);
        setError('뉴스를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background-light dark:bg-background-dark relative">
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
      <section className="py-20 bg-background-light dark:bg-background-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background-light dark:bg-background-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary font-bold tracking-widest text-sm mb-2">NEWS & TIP</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-secondary dark:text-white mb-4">부동산 뉴스 & 팁</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">고덕그라시움·고덕아르테온 등 고덕동, 상일동 일대의 관련 최신 부동산 소식과 소유주를 위한 유용한 콘텐츠를 확인하세요.</p>
        </motion.div>
        <motion.div
          variants={statsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {news.map((item) => (
            <Link to={`/news/${item.id}`} key={item.id} className="block">
              <motion.div variants={statItem} className="bg-white dark:bg-navy-dark rounded-xl overflow-hidden shadow-sm hover-card-effect group cursor-pointer border border-transparent dark:border-gray-800 h-full">
                {item.image ? (
                  <div className="h-48 overflow-hidden relative">
                    <div className={`absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded z-10 ${getCategoryBadgeClass(item.category)}`}>
                      {item.category}
                    </div>
                    <img alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src={getFirstImage(item.image)} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                  </div>
                ) : (
                  <div className="h-12 bg-gray-50 dark:bg-gray-800/30 relative">
                    <div className={`absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded z-10 ${getCategoryBadgeClass(item.category)}`}>
                      {item.category}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h4 className="text-xl font-bold text-secondary dark:text-white mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{stripHtml(item.description)}</p>
                  <span className="inline-flex items-center text-sm font-bold text-primary transition-colors">
                    더보기 <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link to="/news" className="inline-flex items-center text-primary hover:text-secondary dark:hover:text-white transition-colors font-medium group">
            모든 소식 보기 <span className="material-symbols-outlined ml-1 transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

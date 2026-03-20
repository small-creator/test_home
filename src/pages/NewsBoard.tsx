import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { fetchNews, getFirstImage } from '../utils/api';
import type { NewsItem } from '../types';

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

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    // SQLite CURRENT_TIMESTAMP is UTC. Ensure browser parses as UTC correctly.
    const date = new Date(dateString.includes('Z') ? dateString : dateString.replace(' ', 'T') + 'Z');
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default function NewsBoard() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if we start at the top
        window.scrollTo(0, 0);

        async function loadNews() {
            try {
                setLoading(true);
                const data = await fetchNews();
                setNews(data);
            } catch (err) {
                console.error('Failed to load news:', err);
                setError('뉴스를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        }

        loadNews();
    }, []);

    return (
        <div className="py-12 bg-gray-50 dark:bg-background-dark min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
                    <h2 className="text-primary font-bold tracking-widest text-sm mb-2 uppercase">NEWS & TIP</h2>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary dark:text-white mb-4">부동산 뉴스 & 팁</h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                        고덕그라시움·고덕아르테온 등 고덕동, 상일동 일대의 관련 최신 부동산 소식과 소유주를 위한 유용한 콘텐츠를 확인하세요.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">불러오는 중...</div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : news.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">등록된 게시글이 없습니다.</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item, index) => (
                            <Link
                                to={`/news/${item.id}`}
                                key={item.id}
                                className="block"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="bg-white dark:bg-navy-dark rounded-xl overflow-hidden shadow-sm hover-card-effect group border border-gray-100 dark:border-gray-800 h-full"
                                >
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
                                        <h4 className="text-xl font-bold text-secondary dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">{stripHtml(item.description)}</p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(item.created_at)}</span>
                                            <span className="inline-flex items-center text-sm font-bold text-primary transition-colors">
                                                자세히 보기 <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

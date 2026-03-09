import { useState, useEffect } from 'react';
import { fetchNewsItem } from '../utils/api';
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

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default function NewsDetail({ id }: { id: number }) {
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        async function loadNews() {
            try {
                setLoading(true);
                const data = await fetchNewsItem(id);
                if (data) {
                    setNews(data);
                } else {
                    setError('해당 뉴스를 찾을 수 없습니다.');
                }
            } catch (err) {
                console.error('Failed to load news:', err);
                setError('뉴스를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        }

        loadNews();
    }, [id]);

    if (loading) {
        return <div className="text-center py-32 text-gray-500 min-h-screen">불러오는 중...</div>;
    }

    if (error || !news) {
        return (
            <div className="text-center py-32 min-h-screen">
                <h2 className="text-2xl font-bold text-red-500 mb-4">{error || '게시글이 존재하지 않습니다.'}</h2>
                <a href="#/news" className="text-primary hover:underline">목록으로 돌아가기</a>
            </div>
        );
    }

    return (
        <div className="py-12 bg-gray-50 dark:bg-background-dark min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Navigation / Back Button */}
                <div className="mb-8">
                    <a href="#/news" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm mr-1">arrow_back</span>
                        목록으로 돌아가기
                    </a>
                </div>

                {/* Content Card */}
                <article className="bg-white dark:bg-navy-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 md:p-12 border-b border-gray-100 dark:border-gray-800">
                        <div className={`inline-block text-xs font-bold px-3 py-1 rounded mb-6 ${getCategoryBadgeClass(news.category)}`}>
                            {news.category}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary dark:text-white mb-6 leading-tight">
                            {news.title}
                        </h1>

                        <div className="flex items-center text-sm text-gray-400 dark:text-gray-500">
                            <span className="material-symbols-outlined text-base mr-1">schedule</span>
                            {formatDate(news.created_at)}
                        </div>
                    </div>

                    {/* Hero Image */}
                    {news.image && (
                        <div className="w-full aspect-video md:h-[500px] overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                                src={news.image}
                                alt={news.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Body Content */}
                    <div className="p-8 md:p-12">
                        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-line leading-loose">
                            {news.description}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}

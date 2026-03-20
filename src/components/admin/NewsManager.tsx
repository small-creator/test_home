import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fetchNews, deleteNews, getAuthToken, getFirstImage } from '../../utils/api';
import type { NewsItem } from '../../types';
import NewsForm from './NewsForm';

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await fetchNews();
      setNews(data);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingNews(null);
    setShowForm(true);
  };

  const handleEdit = (item: NewsItem) => {
    setEditingNews(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await deleteNews(id, token);
      await loadNews();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete news:', error);
      alert('뉴스 삭제에 실패했습니다.');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingNews(null);
    loadNews();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '뉴스':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '가이드':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '커뮤니티':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  if (showForm) {
    return <NewsForm news={editingNews} onClose={handleFormClose} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-secondary dark:text-white">
          커뮤니티 & 뉴스 관리 ({news.length})
        </h2>
        <button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          뉴스 추가
        </button>
      </div>

      {news.length === 0 ? (
        <div className="bg-white dark:bg-surface-dark rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">article</span>
          <p className="text-gray-500 dark:text-gray-400">등록된 뉴스가 없습니다.</p>
          <button
            onClick={handleAdd}
            className="mt-4 text-primary hover:underline"
          >
            첫 뉴스 추가하기
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {news.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto">
                  <img
                    src={getFirstImage(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="mb-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 sm:flex-initial bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      수정
                    </button>
                    {deleteConfirm === item.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 sm:flex-initial bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                        >
                          확인
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 sm:flex-initial bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-all"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="flex-1 sm:flex-initial bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

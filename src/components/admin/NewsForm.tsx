import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { createNews, updateNews, uploadImage, getAuthToken } from '../../utils/api';
import type { NewsItem, NewsFormData } from '../../types';

interface NewsFormProps {
  news: NewsItem | null;
  onClose: () => void;
}

export default function NewsForm({ news, onClose }: NewsFormProps) {
  const [formData, setFormData] = useState<NewsFormData>({
    category: '뉴스',
    image: '',
    title: '',
    description: ''
  });
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (news) {
      setFormData({
        category: news.category,
        image: news.image,
        title: news.title,
        description: news.description
      });
    }
  }, [news]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = getAuthToken();
    if (!token) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      let imageUrl = formData.image;

      // Upload image if file is selected
      if (imageMode === 'upload' && imageFile) {
        const uploadResult = await uploadImage(imageFile, token);
        if (uploadResult.success && uploadResult.data) {
          imageUrl = uploadResult.data.url;
        } else {
          throw new Error(uploadResult.error || '이미지 업로드 실패');
        }
      }

      const dataToSubmit = { ...formData, image: imageUrl };

      if (news) {
        // Update existing news
        const result = await updateNews(news.id, dataToSubmit, token);
        if (!result.success) {
          throw new Error(result.error || '뉴스 수정 실패');
        }
      } else {
        // Create new news
        const result = await createNews(dataToSubmit, token);
        if (!result.success) {
          throw new Error(result.error || '뉴스 생성 실패');
        }
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-secondary dark:text-white">
          {news ? '뉴스 수정' : '뉴스 추가'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            카테고리
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as '뉴스' | '가이드' | '커뮤니티' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="뉴스">뉴스</option>
            <option value="가이드">가이드</option>
            <option value="커뮤니티">커뮤니티</option>
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            이미지
          </label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={imageMode === 'url'}
                onChange={() => setImageMode('url')}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm">URL 입력</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={imageMode === 'upload'}
                onChange={() => setImageMode('upload')}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm">파일 업로드</span>
            </label>
          </div>
          {imageMode === 'url' ? (
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="https://example.com/image.jpg"
              required
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required={!news}
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            제목
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="지하철 9호선 연장 업데이트"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            설명
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="뉴스 내용을 입력하세요"
            rows={4}
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg transition-all"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? '저장 중...' : news ? '수정하기' : '추가하기'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

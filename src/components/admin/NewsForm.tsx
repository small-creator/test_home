import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { createNews, updateNews, uploadImages, getAuthToken, getAllImages } from '../../utils/api';
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
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
      // 이미지가 /uploads/로 시작하는 경우 파일 업로드 모드로 설정
      if (news.image && (news.image.startsWith('/uploads/') || news.image.startsWith('['))) {
        setImageMode('upload');
        setExistingImages(getAllImages(news.image));
      }
    }
  }, [news]);

  useEffect(() => {
    // 파일 선택 시 미리보기 URL 생성
    const urls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [imageFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setExistingImages([]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

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
      let imageValue = formData.image;

      if (imageMode === 'upload') {
        let allUrls: string[] = [...existingImages];

        // 새로 선택한 파일 업로드
        if (imageFiles.length > 0) {
          const uploadResult = await uploadImages(imageFiles, token);
          if (uploadResult.success && uploadResult.data) {
            const newUrls = uploadResult.data.map(f => f.url);
            allUrls = [...allUrls, ...newUrls];
          } else {
            throw new Error(uploadResult.error || '이미지 업로드 실패');
          }
        }

        if (allUrls.length === 1) {
          imageValue = allUrls[0];
        } else if (allUrls.length > 1) {
          imageValue = JSON.stringify(allUrls);
        } else {
          imageValue = '';
        }
      }

      const dataToSubmit = { ...formData, image: imageValue || '' };

      if (news) {
        const result = await updateNews(news.id, dataToSubmit, token);
        if (!result.success) {
          throw new Error(result.error || '뉴스 수정 실패');
        }
      } else {
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
            onChange={(e) => setFormData({ ...formData, category: e.target.value as '뉴스' | '팁' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="뉴스">뉴스</option>
            <option value="팁">팁</option>
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
              placeholder="https://example.com/image.jpg (선택 사항)"
            />
          ) : (
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                * 여러 장 선택 가능 (최대 20장, 각 10MB 이하)
              </p>

              {/* 기존 이미지 미리보기 (수정 모드) */}
              {existingImages.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">현재 이미지:</p>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((url, idx) => (
                      <div key={idx} className="relative w-24 h-24">
                        <img
                          src={url}
                          alt={`이미지 ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 새로 선택한 이미지 미리보기 */}
              {previewUrls.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">새로 추가할 이미지:</p>
                  <div className="flex flex-wrap gap-2">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative w-24 h-24">
                        <img
                          src={url}
                          alt={`새 이미지 ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
            placeholder="뉴스 내용을 입력하세요. HTML 태그나 마크다운 형식을 사용할 수 있습니다."
            rows={10}
            required
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            * HTML 태그(예: &lt;b&gt;, &lt;br&gt;)나 마크다운 문법이 지원됩니다.
          </p>
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
    </motion.div >
  );
}

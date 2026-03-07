import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { createListing, updateListing, uploadImage, getAuthToken } from '../../utils/api';
import type { Listing, ListingFormData } from '../../types';

interface ListingFormProps {
  listing: Listing | null;
  onClose: () => void;
}

export default function ListingForm({ listing, onClose }: ListingFormProps) {
  const [formData, setFormData] = useState<ListingFormData>({
    image: '',
    price: '',
    title: '',
    type: '매매',
    specs: { size: '', bed: 3, bath: 2 },
    tags: []
  });
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (listing) {
      setFormData({
        image: listing.image,
        price: listing.price,
        title: listing.title,
        type: listing.type,
        specs: listing.specs,
        tags: listing.tags
      });
    }
  }, [listing]);

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

      if (listing) {
        // Update existing listing
        const result = await updateListing(listing.id, dataToSubmit, token);
        if (!result.success) {
          throw new Error(result.error || '매물 수정 실패');
        }
      } else {
        // Create new listing
        const result = await createListing(dataToSubmit, token);
        if (!result.success) {
          throw new Error(result.error || '매물 생성 실패');
        }
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-secondary dark:text-white">
          {listing ? '매물 수정' : '매물 추가'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              required={!listing}
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
            placeholder="고덕그라시움 105동 고층"
            required
          />
        </div>

        {/* Price & Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              가격
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="17억 5,000만"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              유형
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as '매매' | '전세' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="매매">매매</option>
              <option value="전세">전세</option>
            </select>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              면적
            </label>
            <input
              type="text"
              value={formData.specs.size}
              onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, size: e.target.value } })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="84㎡"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              방 개수
            </label>
            <input
              type="number"
              value={formData.specs.bed}
              onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, bed: parseInt(e.target.value) } })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              욕실 개수
            </label>
            <input
              type="number"
              value={formData.specs.bath}
              onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, bath: parseInt(e.target.value) } })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="1"
              required
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            태그
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="태그 입력 (예: 로얄동)"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-all"
            >
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="hover:text-red-500"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </span>
            ))}
          </div>
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
            {loading ? '저장 중...' : listing ? '수정하기' : '추가하기'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

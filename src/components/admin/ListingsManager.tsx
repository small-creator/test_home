import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fetchListings, deleteListing, getAuthToken } from '../../utils/api';
import type { Listing } from '../../types';
import ListingForm from './ListingForm';

export default function ListingsManager() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await fetchListings();
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingListing(null);
    setShowForm(true);
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await deleteListing(id, token);
      await loadListings();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert('매물 삭제에 실패했습니다.');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingListing(null);
    loadListings();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  if (showForm) {
    return <ListingForm listing={editingListing} onClose={handleFormClose} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-secondary dark:text-white">
          매물 관리 ({listings.length})
        </h2>
        <button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          매물 추가
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white dark:bg-surface-dark rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">home_work</span>
          <p className="text-gray-500 dark:text-gray-400">등록된 매물이 없습니다.</p>
          <button
            onClick={handleAdd}
            className="mt-4 text-primary hover:underline"
          >
            첫 매물 추가하기
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          listing.type === '매매'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {listing.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-secondary dark:text-white mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {listing.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">straighten</span>
                      {listing.specs.size}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">bed</span>
                      방 {listing.specs.bed}개
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">shower</span>
                      욕실 {listing.specs.bath}개
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="flex-1 sm:flex-initial bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      수정
                    </button>
                    {deleteConfirm === listing.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(listing.id)}
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
                        onClick={() => setDeleteConfirm(listing.id)}
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

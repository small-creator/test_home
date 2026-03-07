import { useState } from 'react';
import { motion } from 'motion/react';
import { clearAuthToken } from '../../utils/api';
import ListingsManager from './ListingsManager';
import NewsManager from './NewsManager';

type Tab = 'listings' | 'news';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('listings');

  const handleLogout = () => {
    clearAuthToken();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-secondary dark:text-white">
                  큰문부동산 관리자
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  매물 및 뉴스 관리
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined">home</span>
                <span className="hidden sm:inline">메인 페이지</span>
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                activeTab === 'listings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined">home_work</span>
                매물 관리
              </span>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                activeTab === 'news'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined">article</span>
                커뮤니티 관리
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'listings' ? <ListingsManager /> : <NewsManager />}
        </motion.div>
      </main>
    </div>
  );
}

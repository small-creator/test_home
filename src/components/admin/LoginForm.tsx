import React, { useState } from 'react';
import { motion } from 'motion/react';
import { verifyPassword, setAuthToken } from '../../utils/api';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verify password (client-side check)
      if (verifyPassword(password)) {
        // Store token (using password as token for simplicity)
        setAuthToken(password);
        onLoginSuccess();
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <span className="material-symbols-outlined text-white text-3xl">lock</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-secondary dark:text-white mb-2">
              관리자 로그인
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              큰문부동산 관리 페이지
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                placeholder="관리자 비밀번호를 입력하세요"
                required
                autoFocus
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
              >
                <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {error}
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-navy-dark text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin material-symbols-outlined">progress_activity</span>
                  로그인 중...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">login</span>
                  로그인
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              메인 페이지로 돌아가기
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

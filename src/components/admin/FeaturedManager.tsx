import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fetchFeaturedSettings, updateFeaturedSettings, getAuthToken } from '../../utils/api';
import type { FeaturedSetting } from '../../types';

export default function FeaturedManager() {
    const [settings, setSettings] = useState<FeaturedSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await fetchFeaturedSettings();
            setSettings(data);
        } catch (err) {
            console.error('Failed to load featured settings:', err);
            setError('추천 매물 시세를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (id: string, field: 'price_25' | 'price_34', value: string) => {
        setSettings(prev =>
            prev.map(item => item.id === id ? { ...item, [field]: value } : item)
        );
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMsg(null);

            const token = getAuthToken();
            if (!token) throw new Error('No auth token');

            const res = await updateFeaturedSettings(settings, token);
            if (res.success) {
                setSuccessMsg(res.data?.message || '저장되었습니다.');
                setTimeout(() => setSuccessMsg(null), 3000);
            } else {
                throw new Error(res.error || '저장 실패');
            }
        } catch (err) {
            console.error('Failed to save featured settings:', err);
            setError('저장에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">로딩 중...</div>;
    }

    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-secondary dark:text-white">추천 매물 간편 시세 수정</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        메인 페이지의 고덕그라시움 및 아르테온 매물의 시세를 수정합니다. 변경 후 바로 적용됩니다.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary hover:bg-hover text-navy-dark font-bold px-6 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined">save</span>
                    {saving ? '저장 중...' : '변경사항 저장'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    <span>{error}</span>
                </div>
            )}

            {successMsg && (
                <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>{successMsg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {settings.map((item) => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                            {item.title}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    25평 시세
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 font-medium">25평</span>
                                    <input
                                        type="text"
                                        value={item.price_25}
                                        onChange={(e) => handleInputChange(item.id, 'price_25', e.target.value)}
                                        placeholder="예: 19억~"
                                        className="flex-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    34평 시세
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 font-medium">34평</span>
                                    <input
                                        type="text"
                                        value={item.price_34}
                                        onChange={(e) => handleInputChange(item.id, 'price_34', e.target.value)}
                                        placeholder="예: 25억~"
                                        className="flex-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                연결된 이미지: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{item.id.replace('_', '-')} .jpg</code>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

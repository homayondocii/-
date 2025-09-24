import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';

export const SettingsPage: React.FC = () => {
    const { t } = useLocalization();
    const [supabaseUrl, setSupabaseUrl] = useState('');
    const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
    // FIX: Removed state for Gemini API key as it is now handled by environment variables.
    const [message, setMessage] = useState('');

    useEffect(() => {
        setSupabaseUrl(localStorage.getItem('supabaseUrl') || '');
        setSupabaseAnonKey(localStorage.getItem('supabaseAnonKey') || '');
        // FIX: Removed logic for getting Gemini API key from local storage.
    }, []);

    const handleSave = () => {
        localStorage.setItem('supabaseUrl', supabaseUrl.trim());
        localStorage.setItem('supabaseAnonKey', supabaseAnonKey.trim());
        // FIX: Removed logic for saving Gemini API key to local storage.
        setMessage(t('settingsSaved'));
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('settingsTitle')}</h2>
            
            <div className="space-y-8 max-w-2xl mx-auto">
                {/* Supabase Settings */}
                <div className="p-4 border dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('supabaseSettings')}</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="supabaseUrl" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('supabaseUrl')}</label>
                            <input 
                                type="text"
                                id="supabaseUrl"
                                value={supabaseUrl}
                                onChange={(e) => setSupabaseUrl(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="https://xxxxxxxx.supabase.co"
                            />
                        </div>
                        <div>
                            <label htmlFor="supabaseAnonKey" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('supabaseAnonKey')}</label>
                            <input
                                type="password"
                                id="supabaseAnonKey"
                                value={supabaseAnonKey}
                                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="ey..."
                            />
                        </div>
                    </div>
                </div>

                {/* FIX: Removed Gemini Settings UI section. The API key must be configured via environment variables. */}
                
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">{t('settingsHint')}</p>

                {message && (
                    <div className="p-4 text-sm text-green-800 bg-green-50 rounded-lg dark:bg-gray-800 dark:text-green-400" role="alert">
                        <span className="font-medium">{message}</span>
                    </div>
                )}

                <button
                    onClick={handleSave}
                    className="w-full px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    {t('saveSettings')}
                </button>
            </div>
        </div>
    );
};

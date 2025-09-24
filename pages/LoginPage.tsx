import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { signInWithGoogle, isSupabaseConfigured } from '../services/supabaseClient';

export const LoginPage: React.FC = () => {
    const { t } = useLocalization();
    const configured = isSupabaseConfigured();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-lg shadow-2xl dark:bg-gray-800 text-center">
                <div>
                     <svg className="w-16 h-16 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 8l3 5m0 0l3-5m-3 5v4m0 0H9m3 0h3m5-12l-3 5m0 0l-3-5m3 5V4m0 0h3m-3 0H9m12 12l-3-5m0 0l-3 5m3-5v-4m0 0H9m3 0h3"></path></svg>
                    <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{t('loginTitle')}</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('loginDescription')}</p>
                </div>
                
                {configured ? (
                    <button
                        onClick={signInWithGoogle}
                        className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                        <svg className="w-5 h-5 me-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.5 109.8 11.8 244 11.8c70.4 0 134.3 29.4 181.8 78.2l-66.3 66.3C329.8 121.3 289.3 96.8 244 96.8c-88.6 0-160.2 71.6-160.2 160.1s71.6 160.2 160.2 160.2c94.9 0 137-67.5 142.1-102.4H244V243.6h236.4c2.5 12.8 3.6 26.4 3.6 41.8z"></path>
                        </svg>
                        {t('loginWithGoogle')}
                    </button>
                ) : (
                    <div className="p-4 text-sm text-yellow-800 bg-yellow-50 rounded-lg dark:bg-gray-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700" role="alert">
                      <span className="font-medium">{t('loginConfigNeeded')}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
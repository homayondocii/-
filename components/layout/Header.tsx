
import React from 'react';
import { useLocalization } from '../../context/LocalizationContext';
import { Page } from '../../types';

interface HeaderProps {
    currentPage: Page;
    toggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, toggleLanguage }) => {
    const { t, language } = useLocalization();

    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{t(currentPage)}</h1>
            <div className="flex items-center">
                <button 
                    onClick={toggleLanguage} 
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                     <svg className="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4 13l4-4m0 0l4-4m-4 4v12m-4-4l-4 4m0 0l-4 4m4-4V3"></path></svg>
                    <span>{t('toggleLanguage')}</span>
                </button>
            </div>
        </header>
    );
};

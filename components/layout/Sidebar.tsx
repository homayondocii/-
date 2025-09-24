import React from 'react';
import { useLocalization } from '../../context/LocalizationContext';
import { Page } from '../../types';
import { signOut } from '../../services/supabaseClient';
import type { Session } from '@supabase/supabase-js';


interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    session: Session | null;
}

const SidebarLink: React.FC<{
    page: Page;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    label: string;
    icon: JSX.Element;
}> = ({ page, currentPage, setCurrentPage, label, icon }) => {
    const isActive = currentPage === page;
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                setCurrentPage(page);
            }}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="ms-3">{label}</span>
        </a>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, session }) => {
    const { t } = useLocalization();

    const navItems = [
        { page: Page.DASHBOARD, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
        { page: Page.TRANSACTIONS, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg> },
        { page: Page.CHECKS, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> },
        { page: Page.INVENTORY, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg> },
        { page: Page.INVOICE, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg> },
        { page: Page.SETTINGS, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> },
    ];

    return (
        <aside className="w-64" aria-label="Sidebar">
            <div className="flex flex-col h-full overflow-y-auto py-4 px-3 bg-white dark:bg-gray-800 border-e border-gray-200 dark:border-gray-700">
                <div className="flex items-center ps-2.5 mb-5">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8l3 5m0 0l3-5m-3 5v4m0 0H9m3 0h3m5-12l-3 5m0 0l-3-5m3 5V4m0 0h3m-3 0H9m12 12l-3-5m0 0l-3 5m3-5v-4m0 0H9m3 0h3"></path></svg>
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white ms-2">Hesabdar</span>
                </div>
                <ul className="space-y-2 flex-grow">
                    {navItems.map(item => (
                         <li key={item.page}>
                            <SidebarLink 
                                page={item.page}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                label={t(item.page)}
                                icon={item.icon}
                            />
                        </li>
                    ))}
                </ul>
                 {session && (
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center p-2">
                             <img className="w-10 h-10 rounded-full" src={session.user.user_metadata.avatar_url} alt={session.user.user_metadata.full_name} />
                             <div className="ms-3">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{session.user.user_metadata.full_name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => signOut()}
                            className="w-full flex items-center justify-center mt-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                        >
                            <svg className="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            <span>{t('logout')}</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

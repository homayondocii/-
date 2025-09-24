import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { onAuthStateChange, isSupabaseConfigured } from './services/supabaseClient';
import { Language, Page } from './types';
import { LocalizationProvider } from './context/LocalizationContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ChecksPage } from './pages/ChecksPage';
import { InventoryPage } from './pages/InventoryPage';
import { InvoicePage } from './pages/InvoicePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        // Only set up auth listener if supabase is configured
        if (isSupabaseConfigured()) {
            const { data: { subscription } } = onAuthStateChange((_event, session) => {
                setSession(session);
                setLoading(false);
            });
    
            return () => {
                subscription?.unsubscribe();
            };
        } else {
            setLoading(false);
        }
    }, []);

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'en' ? 'fa' : 'en'));
    };

    const renderPage = () => {
        switch (currentPage) {
            case Page.DASHBOARD:
                return <DashboardPage />;
            case Page.TRANSACTIONS:
                return <TransactionsPage />;
            case Page.CHECKS:
                return <ChecksPage />;
            case Page.INVENTORY:
                return <InventoryPage />;
            case Page.INVOICE:
                return <InvoicePage />;
            case Page.SETTINGS:
                return <SettingsPage />;
            default:
                return <DashboardPage />;
        }
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (!session && isSupabaseConfigured()) {
        return (
            <LocalizationProvider language={language}>
                <LoginPage />
            </LocalizationProvider>
        );
    }

    return (
        <LocalizationProvider language={language}>
            <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans ${language === 'fa' ? 'rtl' : 'ltr'}`} dir={language === 'fa' ? 'rtl' : 'ltr'}>
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} session={session} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header currentPage={currentPage} toggleLanguage={toggleLanguage} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                        <div className="container mx-auto px-6 py-8">
                            {renderPage()}
                        </div>
                    </main>
                </div>
            </div>
        </LocalizationProvider>
    );
};

export default App;

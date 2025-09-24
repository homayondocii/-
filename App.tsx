import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ChecksPage } from './pages/ChecksPage';
import { InventoryPage } from './pages/InventoryPage';
import { InvoicePage } from './pages/InvoicePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { LocalizationProvider } from './context/LocalizationContext';
import { supabase, onAuthStateChange, isSupabaseConfigured } from './services/supabaseClient';
import { Page, Language, Transaction, Check, Product } from './types';
import type { Session } from '@supabase/supabase-js';


function App() {
    const [isConfigured, setIsConfigured] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
    const [language, setLanguage] = useState<Language>('fa');
    
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [checks, setChecks] = useState<Check[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        setIsConfigured(isSupabaseConfigured());
    }, []);

    useEffect(() => {
        if (!isConfigured) {
            setLoading(false);
            return;
        }

        const { data: authListener } = onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [isConfigured]);
    
    useEffect(() => {
        if (session && isConfigured) {
            fetchData(session.user.id);
        }
    }, [session, isConfigured]);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    }, [language]);

    const fetchData = async (userId: string) => {
        if (!supabase) return;
        const [transactionsRes, checksRes, productsRes] = await Promise.all([
            supabase.from('transactions').select('*').eq('user_id', userId),
            supabase.from('checks').select('*').eq('user_id', userId),
            supabase.from('products').select('*').eq('user_id', userId)
        ]);
        if (transactionsRes.data) setTransactions(transactionsRes.data as Transaction[]);
        if (checksRes.data) setChecks(checksRes.data as Check[]);
        if (productsRes.data) setProducts(productsRes.data as Product[]);
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'fa' ? 'en' : 'fa');
    };

    const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id'>) => {
        if (!supabase || !session) return;
        const { data, error } = await supabase
            .from('transactions')
            .insert({ ...transaction, user_id: session.user.id })
            .select()
            .single();

        if (data && !error) {
            setTransactions(prev => [...prev, data as Transaction]);
        } else {
            console.error("Error adding transaction:", error);
        }
    };
    
    const addCheck = async (check: Omit<Check, 'id' | 'user_id'>) => {
        if (!supabase || !session) return;
        const { data, error } = await supabase
            .from('checks')
            .insert({ ...check, user_id: session.user.id })
            .select()
            .single();

        if (data && !error) {
            setChecks(prev => [...prev, data as Check]);
        } else {
            console.error("Error adding check:", error);
        }
    };

    const updateProductStock = async (productId: number, amount: number) => {
        if (!supabase || !session) return;
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const newStock = Math.max(0, product.stock + amount);

        const { data, error } = await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', productId)
            .eq('user_id', session.user.id)
            .select()
            .single();

        if (data && !error) {
            setProducts(prev => prev.map(p => p.id === productId ? (data as Product) : p));
        } else {
            console.error("Error updating product stock:", error);
        }
    };

    const renderPage = () => {
        // If not configured, always show settings
        if (!isConfigured) {
             return <SettingsPage />;
        }

        switch (currentPage) {
            case Page.DASHBOARD:
                return <DashboardPage transactions={transactions} checks={checks} />;
            case Page.TRANSACTIONS:
                return <TransactionsPage transactions={transactions} addTransaction={addTransaction} />;
            case Page.CHECKS:
                return <ChecksPage checks={checks} addCheck={addCheck} />;
            case Page.INVENTORY:
                return <InventoryPage products={products} updateProductStock={updateProductStock} />;
            case Page.INVOICE:
                return <InvoicePage />;
            case Page.SETTINGS:
                return <SettingsPage />;
            default:
                return <DashboardPage transactions={transactions} checks={checks} />;
        }
    };
    
    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-white">Loading...</div>;
    }
    
    // If configured, but no session, show login page.
    if (isConfigured && !session) {
        return (
            <LocalizationProvider language={language}>
                <LoginPage />
            </LocalizationProvider>
        );
    }
    
    const pageToRender = isConfigured ? currentPage : Page.SETTINGS;

    return (
        <LocalizationProvider language={language}>
            <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans`}>
                <Sidebar currentPage={pageToRender} setCurrentPage={setCurrentPage} session={session} />
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Header currentPage={pageToRender} toggleLanguage={toggleLanguage} />
                    <main className="p-6">
                        {renderPage()}
                    </main>
                </div>
            </div>
        </LocalizationProvider>
    );
}

export default App;
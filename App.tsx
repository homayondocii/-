
import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ChecksPage } from './pages/ChecksPage';
import { InventoryPage } from './pages/InventoryPage';
import { InvoicePage } from './pages/InvoicePage';
import { LocalizationProvider } from './context/LocalizationContext';
import { Page, Language } from './types';
import { mockTransactions, mockChecks, mockProducts } from './data/mockData';
import type { Transaction, Check, Product } from './types';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
    const [language, setLanguage] = useState<Language>(Language.FA);

    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [checks, setChecks] = useState<Check[]>(mockChecks);
    const [products, setProducts] = useState<Product[]>(mockProducts);

    const toggleLanguage = useCallback(() => {
        const newLang = language === Language.EN ? Language.FA : Language.EN;
        setLanguage(newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === Language.FA ? 'rtl' : 'ltr';
    }, [language]);

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        setTransactions(prev => [{ ...transaction, id: prev.length + 1 }, ...prev]);
    };

    const addCheck = (check: Omit<Check, 'id'>) => {
        setChecks(prev => [{ ...check, id: prev.length + 1 }, ...prev]);
    };
    
    const updateProductStock = (productId: number, amount: number) => {
        setProducts(prev => prev.map(p => p.id === productId ? {...p, stock: p.stock + amount} : p));
    };

    const pageContent = useMemo(() => {
        switch (currentPage) {
            case Page.DASHBOARD:
                return <DashboardPage transactions={transactions} checks={checks} />;
            case Page.TRANSACTIONS:
                return <TransactionsPage transactions={transactions} addTransaction={addTransaction} />;
            case Page.CHECKS:
                return <ChecksPage checks={checks} addCheck={addCheck} />;
            case Page.INVENTORY:
                return <InventoryPage products={products} updateProductStock={updateProductStock} />;
            case Page.INVOICES:
                 return <InvoicePage />;
            default:
                return <DashboardPage transactions={transactions} checks={checks} />;
        }
    }, [currentPage, transactions, checks, products]);

    return (
        <LocalizationProvider language={language}>
            <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 ${language === Language.FA ? 'font-vazir' : 'font-sans'}`}>
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header currentPage={currentPage} toggleLanguage={toggleLanguage} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
                        {pageContent}
                    </main>
                </div>
            </div>
        </LocalizationProvider>
    );
};

export default App;

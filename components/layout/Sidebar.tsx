
import React from 'react';
import { useLocalization } from '../../context/LocalizationContext';
import { Page } from '../../types';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{ icon: JSX.Element; label: string; page: Page; currentPage: Page; onClick: (page: Page) => void; }> = ({ icon, label, page, currentPage, onClick }) => {
    const isActive = currentPage === page;
    return (
        <button
            onClick={() => onClick(page)}
            className={`flex items-center justify-center lg:justify-start p-3 my-1 w-full text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="hidden lg:block ms-3">{label}</span>
        </button>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    const { t } = useLocalization();

    const navItems = [
        { page: Page.DASHBOARD, label: t(Page.DASHBOARD), icon: <DashboardIcon /> },
        { page: Page.TRANSACTIONS, label: t(Page.TRANSACTIONS), icon: <TransactionsIcon /> },
        { page: Page.CHECKS, label: t(Page.CHECKS), icon: <ChecksIcon /> },
        { page: Page.INVENTORY, label: t(Page.INVENTORY), icon: <InventoryIcon /> },
        { page: Page.INVOICES, label: t(Page.INVOICES), icon: <InvoicesIcon /> },
    ];

    return (
        <aside className="w-16 lg:w-64 bg-white dark:bg-gray-800 border-e border-gray-200 dark:border-gray-700 transition-all duration-300">
            <div className="flex flex-col h-full p-2 lg:p-4">
                <div className="flex items-center justify-center h-16 mb-4">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h1 className="hidden lg:block ms-2 text-xl font-bold text-gray-800 dark:text-white">حسابدار من</h1>
                </div>
                <nav>
                    {navItems.map(item => (
                        <NavItem
                            key={item.page}
                            icon={item.icon}
                            label={item.label}
                            page={item.page}
                            currentPage={currentPage}
                            onClick={setCurrentPage}
                        />
                    ))}
                </nav>
            </div>
        </aside>
    );
};

// SVG Icons
const DashboardIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
);
const TransactionsIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
);
const ChecksIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);
const InventoryIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
);
const InvoicesIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
);

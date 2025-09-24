import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { mockInvoices } from '../data/mockData';
import { Invoice } from '../types';

export const InvoicePage: React.FC = () => {
    const { t, language } = useLocalization();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const statusBadge = (status: Invoice['status']) => {
        const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
        switch (status) {
            case 'paid':
                return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>{t('paid')}</span>;
            case 'unpaid':
                return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>{t('unpaid')}</span>;
            case 'overdue':
                return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`}>{t('overdue')}</span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('invoice')}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('invoiceNumber')}</th>
                            <th scope="col" className="px-6 py-3">{t('customerName')}</th>
                            <th scope="col" className="px-6 py-3">{t('dueDate')}</th>
                            <th scope="col" className="px-6 py-3 text-center">{t('status')}</th>
                            <th scope="col" className="px-6 py-3 text-right">{t('amount')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockInvoices.map((invoice: Invoice) => (
                            <tr key={invoice.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-mono">{invoice.invoiceNumber}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{invoice.customerName}</td>
                                <td className="px-6 py-4">{formatDate(invoice.dueDate)}</td>
                                <td className="px-6 py-4 text-center">{statusBadge(invoice.status)}</td>
                                <td className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-white">{formatCurrency(invoice.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { mockTransactions } from '../data/mockData';
import { Transaction } from '../types';

export const TransactionsPage: React.FC = () => {
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

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('transactions')}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('date')}</th>
                            <th scope="col" className="px-6 py-3">{t('description')}</th>
                            <th scope="col" className="px-6 py-3">{t('category')}</th>
                            <th scope="col" className="px-6 py-3 text-right">{t('amount')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTransactions.map((tx: Transaction) => (
                            <tr key={tx.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">{formatDate(tx.date)}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{tx.description}</td>
                                <td className="px-6 py-4">{tx.category}</td>
                                <td className={`px-6 py-4 text-right font-semibold ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

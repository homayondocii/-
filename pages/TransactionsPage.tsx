
import React, { useState, useMemo } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { Transaction, TransactionType } from '../types';

interface TransactionsPageProps {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, addTransaction }) => {
    const { t, language } = useLocalization();
    const [filter, setFilter] = useState<TransactionType | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(value);
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const typeMatch = filter === 'all' || tx.type === filter;
            const searchMatch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                tx.category.toLowerCase().includes(searchTerm.toLowerCase());
            return typeMatch && searchMatch;
        });
    }, [transactions, filter, searchTerm]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('transactionsTitle')}</h2>
                <div className="flex items-center gap-2">
                    <input 
                        type="text"
                        placeholder="جستجو..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                    <select 
                        value={filter}
                        onChange={e => setFilter(e.target.value as TransactionType | 'all')}
                        className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="all">{t('all')}</option>
                        <option value={TransactionType.INCOME}>{t('income')}</option>
                        <option value={TransactionType.EXPENSE}>{t('expense')}</option>
                    </select>
                </div>
            </div>

             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('description')}</th>
                            <th scope="col" className="px-6 py-3">{t('category')}</th>
                            <th scope="col" className="px-6 py-3">{t('date')}</th>
                            <th scope="col" className="px-6 py-3">{t('type')}</th>
                            <th scope="col" className="px-6 py-3 text-end">{t('amount')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(tx => (
                            <tr key={tx.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{tx.description}</td>
                                <td className="px-6 py-4">{tx.category}</td>
                                <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.type === TransactionType.INCOME ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                        {t(tx.type)}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 text-end font-semibold ${tx.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(tx.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

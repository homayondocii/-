// FIX: Created the TransactionsPage component from scratch to allow users to view and add financial transactions.
// This resolves the module not found error in App.tsx.

import React, { useState, useMemo } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { Transaction, TransactionType } from '../types';

interface TransactionsPageProps {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id'>) => Promise<void>;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, addTransaction }) => {
    const { t, language } = useLocalization();
    const [showModal, setShowModal] = useState(false);
    const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id' | 'user_id'>>({
        type: TransactionType.EXPENSE,
        category: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(value);
    };

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTransaction.category && newTransaction.amount > 0) {
            await addTransaction(newTransaction);
            setShowModal(false);
            setNewTransaction({
                type: TransactionType.EXPENSE,
                category: '',
                description: '',
                amount: 0,
                date: new Date().toISOString().split('T')[0],
            });
        }
    };

    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions]);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('transactions')}</h2>
                    <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('addTransaction')}</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('date')}</th>
                                <th scope="col" className="px-6 py-3">{t('type')}</th>
                                <th scope="col" className="px-6 py-3">{t('category')}</th>
                                <th scope="col" className="px-6 py-3">{t('description')}</th>
                                <th scope="col" className="px-6 py-3 text-right">{t('amount')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTransactions.map(tx => (
                                <tr key={tx.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${tx.type === TransactionType.INCOME ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {t(tx.type)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{tx.category}</td>
                                    <td className="px-6 py-4">{tx.description}</td>
                                    <td className={`px-6 py-4 text-right font-semibold ${tx.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(tx.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">{t('addNewTransaction')}</h3>
                        <form onSubmit={handleAddTransaction} className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">{t('transactionType')}</label>
                                <select value={newTransaction.type} onChange={e => setNewTransaction({...newTransaction, type: e.target.value as TransactionType})} className="w-full p-2.5 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                                    <option value={TransactionType.EXPENSE}>{t('expense')}</option>
                                    <option value={TransactionType.INCOME}>{t('income')}</option>
                                </select>
                            </div>
                             <div>
                                <label className="block mb-2 text-sm font-medium">{t('category')}</label>
                                <input type="text" value={newTransaction.category} onChange={e => setNewTransaction({...newTransaction, category: e.target.value})} className="w-full p-2.5 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">{t('description')}</label>
                                <input type="text" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} className="w-full p-2.5 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">{t('amount')}</label>
                                <input type="number" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})} className="w-full p-2.5 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">{t('date')}</label>
                                <input type="date" value={newTransaction.date} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} className="w-full p-2.5 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">{t('close')}</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{t('addTransaction')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

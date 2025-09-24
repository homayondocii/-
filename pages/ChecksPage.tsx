// FIX: Created the ChecksPage component from scratch for managing incoming and outgoing checks.
// This resolves the module not found error in App.tsx.

import React, { useState, useMemo } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { Check, CheckType, CheckStatus } from '../types';

interface ChecksPageProps {
    checks: Check[];
    addCheck: (check: Omit<Check, 'id' | 'user_id'>) => Promise<void>;
}

export const ChecksPage: React.FC<ChecksPageProps> = ({ checks, addCheck }) => {
    const { t, language } = useLocalization();
    const [showModal, setShowModal] = useState(false);
    const [newCheck, setNewCheck] = useState<Omit<Check, 'id' | 'user_id'>>({
        type: CheckType.OUTGOING,
        payee: '',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        status: CheckStatus.PENDING,
        description: '',
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(value);
    };

    const handleAddCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newCheck.payee && newCheck.amount > 0) {
            await addCheck(newCheck);
            setShowModal(false);
            setNewCheck({
                type: CheckType.OUTGOING,
                payee: '',
                amount: 0,
                dueDate: new Date().toISOString().split('T')[0],
                status: CheckStatus.PENDING,
                description: '',
            });
        }
    };
    
    const getStatusColor = (status: CheckStatus) => {
        switch (status) {
            case CheckStatus.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case CheckStatus.CASHED: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case CheckStatus.BOUNCED: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const sortedChecks = useMemo(() => {
        return [...checks].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    }, [checks]);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('checks')}</h2>
                    <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('addCheck')}</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('dueDate')}</th>
                                <th scope="col" className="px-6 py-3">{t('type')}</th>
                                <th scope="col" className="px-6 py-3">{t('payee')}</th>
                                <th scope="col" className="px-6 py-3">{t('description')}</th>
                                <th scope="col" className="px-6 py-3">{t('status')}</th>
                                <th scope="col" className="px-6 py-3 text-right">{t('amount')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedChecks.map(check => (
                                <tr key={check.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{new Date(check.dueDate).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${check.type === CheckType.INCOMING ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}`}>
                                            {t(check.type)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{check.payee}</td>
                                    <td className="px-6 py-4">{check.description}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(check.status)}`}>
                                            {t(check.status)}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-semibold ${check.type === CheckType.INCOMING ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(check.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">{t('addNewCheck')}</h3>
                        <form onSubmit={handleAddCheck} className="space-y-4">
                             <div>
                                <label className="block mb-2 text-sm font-medium">{t('checkType')}</label>
                                <select value={newCheck.type} onChange={e => setNewCheck({...newCheck, type: e.target.value as CheckType})} className="w-full p-2.5 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                                    <option value={CheckType.OUTGOING}>{t('outgoing')}</option>
                                    <option value={CheckType.INCOMING}>{t('incoming')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">{t('payee')}</label>
                                <input type="text" value={newCheck.payee} onChange={e => setNewCheck({...newCheck, payee: e.target.value})} className="w-full p-2.5 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">{t('description')}</label>
                                <input type="text" value={newCheck.description} onChange={e => setNewCheck({...newCheck, description: e.target.value})} className="w-full p-2.5 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">{t('amount')}</label>
                                <input type="number" value={newCheck.amount} onChange={e => setNewCheck({...newCheck, amount: parseFloat(e.target.value) || 0})} className="w-full p-2.5 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">{t('dueDate')}</label>
                                <input type="date" value={newCheck.dueDate} onChange={e => setNewCheck({...newCheck, dueDate: e.target.value})} className="w-full p-2.5 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">{t('checkStatus')}</label>
                                <select value={newCheck.status} onChange={e => setNewCheck({...newCheck, status: e.target.value as CheckStatus})} className="w-full p-2.5 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                                    <option value={CheckStatus.PENDING}>{t('pending')}</option>
                                    <option value={CheckStatus.CASHED}>{t('cashed')}</option>
                                    <option value={CheckStatus.BOUNCED}>{t('bounced')}</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">{t('close')}</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{t('addCheck')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

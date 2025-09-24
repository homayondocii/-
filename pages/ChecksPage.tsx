
import React, { useState, useMemo } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { Check, CheckType, CheckStatus } from '../types';

interface ChecksPageProps {
    checks: Check[];
    addCheck: (check: Omit<Check, 'id'>) => void;
}

const statusStyles = {
    [CheckStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [CheckStatus.CASHED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [CheckStatus.BOUNCED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const ChecksPage: React.FC<ChecksPageProps> = ({ checks, addCheck }) => {
    const { t, language } = useLocalization();
    const [searchTerm, setSearchTerm] = useState('');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(value);
    };

    const filteredChecks = useMemo(() => {
        return checks.filter(c =>
            c.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [checks, searchTerm]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('checksTitle')}</h2>
                 <input 
                    type="text"
                    placeholder="جستجو در payee یا توضیحات..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('payee')}</th>
                            <th scope="col" className="px-6 py-3">{t('description')}</th>
                            <th scope="col" className="px-6 py-3">{t('dueDate')}</th>
                            <th scope="col" className="px-6 py-3">{t('type')}</th>
                            <th scope="col" className="px-6 py-3">{t('status')}</th>
                            <th scope="col" className="px-6 py-3 text-end">{t('amount')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChecks.map(check => (
                            <tr key={check.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{check.payee}</td>
                                <td className="px-6 py-4">{check.description}</td>
                                <td className="px-6 py-4">{new Date(check.dueDate).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</td>
                                <td className="px-6 py-4">{t(check.type)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[check.status]}`}>
                                        {t(check.status)}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 text-end font-semibold ${check.type === CheckType.INCOMING ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(check.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { mockChecks } from '../data/mockData';
import { Check } from '../types';

export const ChecksPage: React.FC = () => {
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

    const statusBadge = (status: Check['status']) => {
        const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
        switch (status) {
            case 'cashed':
                return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>{t('cashed')}</span>;
            case 'pending':
                return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>{t('pending')}</span>;
            case 'bounced':
                return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`}>{t('bounced')}</span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('checks')}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('checkNumber')}</th>
                            <th scope="col" className="px-6 py-3">{t('payee')}</th>
                            <th scope="col" className="px-6 py-3">{t('date')}</th>
                            <th scope="col" className="px-6 py-3 text-center">{t('status')}</th>
                            <th scope="col" className="px-6 py-3 text-right">{t('amount')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockChecks.map((check: Check) => (
                            <tr key={check.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-mono">{check.checkNumber}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{check.payee}</td>
                                <td className="px-6 py-4">{formatDate(check.date)}</td>
                                <td className="px-6 py-4 text-center">{statusBadge(check.status)}</td>
                                <td className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-white">{formatCurrency(check.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

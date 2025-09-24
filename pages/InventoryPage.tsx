import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { mockInventory } from '../data/mockData';
import { InventoryItem } from '../types';

export const InventoryPage: React.FC = () => {
    const { t, language } = useLocalization();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US');
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('inventory')}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('itemName')}</th>
                            <th scope="col" className="px-6 py-3">{t('supplier')}</th>
                            <th scope="col" className="px-6 py-3 text-right">{t('quantity')}</th>
                            <th scope="col" className="px-6 py-3 text-right">{t('unitPrice')}</th>
                            <th scope="col" className="px-6 py-3 text-right">{t('totalValue')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockInventory.map((item: InventoryItem) => (
                            <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.name}</td>
                                <td className="px-6 py-4">{item.supplier}</td>
                                <td className="px-6 py-4 text-right">{formatNumber(item.quantity)}</td>
                                <td className="px-6 py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                                <td className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-white">{formatCurrency(item.quantity * item.unitPrice)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

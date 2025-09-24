
import React, { useState, useMemo } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { Product } from '../types';

interface InventoryPageProps {
    products: Product[];
    updateProductStock: (productId: number, amount: number) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ products, updateProductStock }) => {
    const { t, language } = useLocalization();
    const [searchTerm, setSearchTerm] = useState('');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(value);
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.barcode.includes(searchTerm)
        );
    }, [products, searchTerm]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('inventoryTitle')}</h2>
                <input
                    type="text"
                    placeholder="جستجو بر اساس نام یا بارکد..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('productName')}</th>
                            <th scope="col" className="px-6 py-3">{t('barcode')}</th>
                            <th scope="col" className="px-6 py-3">{t('stock')}</th>
                            <th scope="col" className="px-6 py-3">{t('price')}</th>
                            <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{product.name}</td>
                                <td className="px-6 py-4 font-mono">{product.barcode}</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => updateProductStock(product.id, 1)} className="font-medium text-green-600 dark:text-green-500 hover:underline mx-1">ورود</button>
                                    <button onClick={() => updateProductStock(product.id, -1)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">خروج</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

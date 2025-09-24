
import React, { useState, useRef } from 'react';
import { useLocalization } from '../context/LocalizationContext';

interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
}

export const InvoicePage: React.FC = () => {
    const { t } = useLocalization();
    const [logo, setLogo] = useState<string | null>(null);
    const [billTo, setBillTo] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, price: 0 }]);
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setLogo(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleItemChange = <K extends keyof InvoiceItem>(index: number, field: K, value: InvoiceItem[K]) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const tax = subtotal * 0.09; // 9% tax example
    const grandTotal = subtotal + tax;

    const handlePrint = () => {
        const printContent = invoiceRef.current?.innerHTML;
        const originalContent = document.body.innerHTML;
        if (printContent) {
            document.body.innerHTML = printContent;
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('invoiceTitle')}</h2>
                <div>
                    <label className="block mb-2 text-sm font-medium">{t('uploadLogo')}</label>
                    <input type="file" onChange={handleLogoUpload} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>
                </div>
                 <div>
                    <label className="block mb-2 text-sm font-medium">{t('billTo')}</label>
                    <textarea value={billTo} onChange={(e) => setBillTo(e.target.value)} rows={3} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"></textarea>
                </div>
                {items.map((item, index) => (
                    <div key={index} className="border p-3 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                           <h4 className="font-semibold">{t('invoiceItem')} #{index + 1}</h4>
                           <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">{t('removeItem')}</button>
                        </div>
                        <input type="text" placeholder={t('item')} value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        <div className="flex gap-2">
                            <input type="number" placeholder={t('quantity')} value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)} className="w-1/2 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            <input type="number" placeholder={t('unitPrice')} value={item.price} onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} className="w-1/2 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    </div>
                ))}
                <button onClick={addItem} className="w-full py-2 text-sm bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">{t('addItem')}</button>
                <button onClick={handlePrint} className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">{t('printInvoice')}</button>
            </div>
            
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                <div ref={invoiceRef} className="p-4 text-black">
                     <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold">{t('invoiceHeader')}</h1>
                            <p>{t('invoiceNumber')}: INV-{new Date().getFullYear()}-001</p>
                            <p>{t('invoiceDate')}: {new Date().toLocaleDateString('fa-IR')}</p>
                        </div>
                        {logo && <img src={logo} alt="logo" className="w-24 h-24 object-contain" />}
                    </div>
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold mb-2">{t('billTo')}:</h2>
                        <p className="whitespace-pre-line">{billTo}</p>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('item')}</th>
                                <th scope="col" className="px-6 py-3">{t('quantity')}</th>
                                <th scope="col" className="px-6 py-3">{t('unitPrice')}</th>
                                <th scope="col" className="px-6 py-3 text-right">{t('total')}</th>
                            </tr>
                        </thead>
                        <tbody>
                        {items.map((item, i) => (
                            <tr key={i} className="border-b">
                                <td className="px-6 py-4 font-medium">{item.description}</td>
                                <td className="px-6 py-4">{item.quantity}</td>
                                <td className="px-6 py-4">{item.price.toLocaleString('fa-IR')}</td>
                                <td className="px-6 py-4 text-right">{(item.quantity * item.price).toLocaleString('fa-IR')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end mt-8">
                         <div className="w-full max-w-xs space-y-2">
                             <div className="flex justify-between"><span>{t('subtotal')}:</span><span>{subtotal.toLocaleString('fa-IR')}</span></div>
                             <div className="flex justify-between"><span>{t('tax')} (9%):</span><span>{tax.toLocaleString('fa-IR')}</span></div>
                             <hr/>
                             <div className="flex justify-between font-bold text-lg"><span>{t('grandTotal')}:</span><span>{grandTotal.toLocaleString('fa-IR')}</span></div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { FinancialAssistant } from '../components/dashboard/FinancialAssistant';
import { mockDataSummary, mockTransactions, mockChecks, mockInventory, mockInvoices } from '../data/mockData';
import { useLocalization } from '../context/LocalizationContext';

interface DataSummaryCardProps {
    title: string;
    value: number;
    isCurrency?: boolean;
}

const DataSummaryCard: React.FC<DataSummaryCardProps> = ({ title, value, isCurrency = false }) => {
    const { language } = useLocalization();
    const formattedValue = isCurrency 
        ? new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US', { style: 'currency', currency: 'USD' }).format(value)
        : value.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US');

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h4>
            <p className={`text-2xl font-semibold mt-2 ${value >= 0 ? 'text-gray-800 dark:text-white' : 'text-red-500'}`}>
                {formattedValue}
            </p>
        </div>
    );
};


export const DashboardPage: React.FC = () => {
    const { t } = useLocalization();

    const allData = {
        summary: mockDataSummary,
        transactions: mockTransactions,
        checks: mockChecks,
        inventory: mockInventory,
        invoices: mockInvoices,
    };
    
    // Convert all data to a JSON string to provide context to the assistant
    const contextData = JSON.stringify(allData, null, 2);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DataSummaryCard title={t('totalIncome')} value={mockDataSummary.totalIncome} isCurrency={true} />
                <DataSummaryCard title={t('totalExpense')} value={mockDataSummary.totalExpense} isCurrency={true} />
                <DataSummaryCard title={t('netProfit')} value={mockDataSummary.netProfit} isCurrency={true} />
                <DataSummaryCard title={t('pendingChecks')} value={mockDataSummary.pendingChecks} isCurrency={true} />
                <DataSummaryCard title={t('inventoryValue')} value={mockDataSummary.inventoryValue} isCurrency={true} />
                <DataSummaryCard title={t('unpaidInvoices')} value={mockDataSummary.unpaidInvoices} isCurrency={true} />
            </div>

            <FinancialAssistant contextData={contextData} />
        </div>
    );
};

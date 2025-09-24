// FIX: Created the DashboardPage component from scratch to provide a landing page for the application.
// It includes financial summaries, charts, and the AI assistant. This resolves the module not found error in App.tsx.

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocalization } from '../context/LocalizationContext';
import { Transaction, TransactionType, Check, CheckStatus } from '../types';
import { FinancialAssistant } from '../components/dashboard/FinancialAssistant';

interface DashboardPageProps {
    transactions: Transaction[];
    checks: Check[];
}

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6`}>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

export const DashboardPage: React.FC<DashboardPageProps> = ({ transactions, checks }) => {
    const { t, language } = useLocalization();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(value);
    };

    const financialSummary = useMemo(() => {
        const totalIncome = transactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
        const netBalance = totalIncome - totalExpense;
        return { totalIncome, totalExpense, netBalance };
    }, [transactions]);

    const chartData = useMemo(() => {
        const dataMap = new Map<string, { name: string; income: number; expense: number }>();
        transactions.forEach(t => {
            const month = new Date(t.date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', { year: 'numeric', month: 'short' });
            if (!dataMap.has(month)) {
                dataMap.set(month, { name: month, income: 0, expense: 0 });
            }
            const entry = dataMap.get(month)!;
            if (t.type === TransactionType.INCOME) {
                entry.income += t.amount;
            } else {
                entry.expense += t.amount;
            }
        });
        return Array.from(dataMap.values()).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    }, [transactions, language]);

    const upcomingChecks = useMemo(() => {
        return checks
            .filter(c => c.status === CheckStatus.PENDING && new Date(c.dueDate) >= new Date())
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5);
    }, [checks]);
    
    const contextDataForAI = JSON.stringify({
        summary: financialSummary,
        transactions,
        checks,
    }, null, 2);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title={t('totalIncome')} value={formatCurrency(financialSummary.totalIncome)} color="text-green-500" />
                <StatCard title={t('totalExpense')} value={formatCurrency(financialSummary.totalExpense)} color="text-red-500" />
                <StatCard title={t('netBalance')} value={formatCurrency(financialSummary.netBalance)} color={financialSummary.netBalance >= 0 ? 'text-blue-500' : 'text-red-500'} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">{t('incomeVsExpense')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={formatCurrency} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="income" fill="#22c55e" name={t('income')} />
                            <Bar dataKey="expense" fill="#ef4444" name={t('expense')} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                     <h3 className="text-lg font-semibold mb-4">{t('upcomingChecks')}</h3>
                     <div className="space-y-3">
                         {upcomingChecks.length > 0 ? (
                             upcomingChecks.map(check => (
                                <div key={check.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                     <div>
                                         <p className="font-medium">{check.payee}</p>
                                         <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(check.dueDate).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</p>
                                     </div>
                                     <p className={`font-semibold ${check.type === 'incoming' ? 'text-green-500' : 'text-red-500'}`}>
                                         {formatCurrency(check.amount)}
                                     </p>
                                 </div>
                            ))
                         ) : <p className="text-sm text-gray-500 dark:text-gray-400">{t('noData')}</p>}
                     </div>
                </div>
            </div>

            <FinancialAssistant contextData={contextDataForAI} />
        </div>
    );
};

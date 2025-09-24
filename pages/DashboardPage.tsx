
import React, { useMemo } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { Transaction, TransactionType, Check, CheckStatus } from '../types';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { FinancialAssistant } from '../components/dashboard/FinancialAssistant';

interface DashboardPageProps {
    transactions: Transaction[];
    checks: Check[];
}

const SummaryCard: React.FC<{ title: string; value: string; icon: JSX.Element; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-4 rtl:space-x-reverse">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);

export const DashboardPage: React.FC<DashboardPageProps> = ({ transactions, checks }) => {
    const { t, language } = useLocalization();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(value);
    };

    const financialSummary = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyIncome = transactions
            .filter(tx => tx.type === TransactionType.INCOME && new Date(tx.date).getMonth() === currentMonth && new Date(tx.date).getFullYear() === currentYear)
            .reduce((sum, tx) => sum + tx.amount, 0);

        const monthlyExpense = transactions
            .filter(tx => tx.type === TransactionType.EXPENSE && new Date(tx.date).getMonth() === currentMonth && new Date(tx.date).getFullYear() === currentYear)
            .reduce((sum, tx) => sum + tx.amount, 0);
        
        const totalBalance = transactions.reduce((acc, tx) => acc + (tx.type === TransactionType.INCOME ? tx.amount : -tx.amount), 0);

        return {
            totalBalance,
            monthlyIncome,
            monthlyExpense,
            netProfit: monthlyIncome - monthlyExpense,
        };
    }, [transactions]);
    
    const chartData = useMemo(() => {
        const dataByMonth: { [key: string]: { month: string; income: number; expense: number } } = {};
        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!dataByMonth[monthKey]) {
                dataByMonth[monthKey] = {
                    month: new Intl.DateTimeFormat(language, { month: 'short', year: 'numeric' }).format(date),
                    income: 0,
                    expense: 0
                };
            }
            if (tx.type === TransactionType.INCOME) {
                dataByMonth[monthKey].income += tx.amount;
            } else {
                dataByMonth[monthKey].expense += tx.amount;
            }
        });
        return Object.values(dataByMonth).sort((a,b) => a.month.localeCompare(b.month));
    }, [transactions, language]);
    
    const upcomingChecks = useMemo(() => {
        return checks
            .filter(c => c.status === CheckStatus.PENDING && new Date(c.dueDate) >= new Date())
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5);
    }, [checks]);

    const contextDataForAI = useMemo(() => JSON.stringify({ transactions, checks }, null, 2), [transactions, checks]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboardTitle')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <SummaryCard title={t('totalBalance')} value={formatCurrency(financialSummary.totalBalance)} color="bg-blue-100 dark:bg-blue-900" icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>} />
                <SummaryCard title={t('monthlyIncome')} value={formatCurrency(financialSummary.monthlyIncome)} color="bg-green-100 dark:bg-green-900" icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>} />
                <SummaryCard title={t('monthlyExpense')} value={formatCurrency(financialSummary.monthlyExpense)} color="bg-red-100 dark:bg-red-900" icon={<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>} />
                <SummaryCard title={t('netProfit')} value={formatCurrency(financialSummary.netProfit)} color="bg-yellow-100 dark:bg-yellow-900" icon={<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">{t('profitAndLoss')}</h3>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={val => formatCurrency(val as number)} />
                                <Tooltip formatter={(value) => formatCurrency(value as number)}/>
                                <Legend />
                                <Line type="monotone" dataKey="income" name={t('income')} stroke="#10B981" strokeWidth={2} />
                                <Line type="monotone" dataKey="expense" name={t('expense')} stroke="#EF4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">{t('upcomingChecks')}</h3>
                    <div className="space-y-4">
                        {upcomingChecks.length > 0 ? upcomingChecks.map(check => (
                            <div key={check.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{check.payee}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(check.dueDate).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</p>
                                </div>
                                <p className="font-semibold text-red-500">{formatCurrency(check.amount)}</p>
                            </div>
                        )) : <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">چک فعالی برای آینده نزدیک وجود ندارد.</p>}
                    </div>
                </div>
            </div>
            
            <FinancialAssistant contextData={contextDataForAI} />
        </div>
    );
};

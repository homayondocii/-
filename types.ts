export enum Page {
    DASHBOARD = 'dashboard',
    TRANSACTIONS = 'transactions',
    CHECKS = 'checks',
    INVENTORY = 'inventory',
    INVOICE = 'invoice',
    SETTINGS = 'settings',
}

export type Language = 'en' | 'fa';

export interface Transaction {
    id: string;
    date: string; // ISO string
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
}

export interface Check {
    id: string;
    checkNumber: string;
    payee: string;
    amount: number;
    date: string; // ISO string
    status: 'cashed' | 'pending' | 'bounced';
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    supplier: string;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    amount: number;
    dueDate: string; // ISO string
    status: 'paid' | 'unpaid' | 'overdue';
}

export interface DataSummary {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    pendingChecks: number;
    inventoryValue: number;
    unpaidInvoices: number;
}

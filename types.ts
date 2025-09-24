export type Language = 'en' | 'fa';

export enum Page {
    DASHBOARD = 'dashboard',
    TRANSACTIONS = 'transactions',
    CHECKS = 'checks',
    INVENTORY = 'inventory',
    INVOICE = 'invoice',
    SETTINGS = 'settings',
}

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export interface Transaction {
    id: number;
    type: TransactionType;
    category: string;
    description: string;
    amount: number;
    date: string; // ISO string format
    user_id?: string;
}

export enum CheckType {
    INCOMING = 'incoming',
    OUTGOING = 'outgoing',
}

export enum CheckStatus {
    PENDING = 'pending',
    CASHED = 'cashed',
    BOUNCED = 'bounced',
}

export interface Check {
    id: number;
    type: CheckType;
    payee: string;
    amount: number;
    dueDate: string; // ISO string format
    status: CheckStatus;
    description: string;
    user_id?: string;
}

export interface Product {
    id: number;
    name: string;
    barcode: string;
    stock: number;
    price: number;
    user_id?: string;
}

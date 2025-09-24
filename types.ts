
export enum Language {
    FA = 'fa',
    EN = 'en',
}

export enum Page {
    DASHBOARD = 'dashboard',
    TRANSACTIONS = 'transactions',
    CHECKS = 'checks',
    INVENTORY = 'inventory',
    INVOICES = 'invoices',
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
    date: string; // ISO format
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
    dueDate: string; // ISO format
    status: CheckStatus;
    description: string;
}

export interface Product {
    id: number;
    name: string;
    barcode: string;
    stock: number;
    price: number;
}

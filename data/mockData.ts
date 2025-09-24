import { Transaction, Check, InventoryItem, Invoice, DataSummary } from '../types';

export const mockTransactions: Transaction[] = [
    { id: '1', date: '2023-10-26T10:00:00Z', description: 'Office Supplies', amount: 150.00, type: 'expense', category: 'Office' },
    { id: '2', date: '2023-10-26T14:30:00Z', description: 'Client Payment - Project X', amount: 2500.00, type: 'income', category: 'Sales' },
    { id: '3', date: '2023-10-25T09:00:00Z', description: 'Software Subscription', amount: 49.99, type: 'expense', category: 'Software' },
    { id: '4', date: '2023-10-24T18:00:00Z', description: 'Consulting Fee', amount: 1200.00, type: 'income', category: 'Services' },
    { id: '5', date: '2023-10-23T11:45:00Z', description: 'Team Lunch', amount: 85.50, type: 'expense', category: 'Meals' },
];

export const mockChecks: Check[] = [
    { id: '1', checkNumber: '1001', payee: 'Supplier A', amount: 500.00, date: '2023-11-01T00:00:00Z', status: 'pending' },
    { id: '2', checkNumber: '1002', payee: 'Landlord', amount: 1500.00, date: '2023-10-20T00:00:00Z', status: 'cashed' },
    { id: '3', checkNumber: '1003', payee: 'Utility Company', amount: 250.00, date: '2023-11-05T00:00:00Z', status: 'pending' },
    { id: '4', checkNumber: '1004', payee: 'Supplier B', amount: 750.00, date: '2023-10-15T00:00:00Z', status: 'cashed' },
    { id: '5', checkNumber: '1005', payee: 'Marketing Agency', amount: 1000.00, date: '2023-11-10T00:00:00Z', status: 'pending' },
];

export const mockInventory: InventoryItem[] = [
    { id: '1', name: 'Product A', quantity: 100, unitPrice: 10.00, supplier: 'Supplier A' },
    { id: '2', name: 'Product B', quantity: 50, unitPrice: 25.00, supplier: 'Supplier B' },
    { id: '3', name: 'Product C', quantity: 200, unitPrice: 5.00, supplier: 'Supplier A' },
    { id: '4', name: 'Product D', quantity: 75, unitPrice: 50.00, supplier: 'Supplier C' },
];

export const mockInvoices: Invoice[] = [
    { id: '1', invoiceNumber: 'INV-001', customerName: 'Customer X', amount: 1250.00, dueDate: '2023-11-15T00:00:00Z', status: 'unpaid' },
    { id: '2', invoiceNumber: 'INV-002', customerName: 'Customer Y', amount: 800.00, dueDate: '2023-10-20T00:00:00Z', status: 'paid' },
    { id: '3', invoiceNumber: 'INV-003', customerName: 'Customer Z', amount: 3000.00, dueDate: '2023-11-25T00:00:00Z', status: 'unpaid' },
    { id: '4', invoiceNumber: 'INV-004', customerName: 'Customer X', amount: 500.00, dueDate: '2023-09-30T00:00:00Z', status: 'overdue' },
];

export const mockDataSummary: DataSummary = {
    totalIncome: mockTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
    totalExpense: mockTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
    netProfit: mockTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) - mockTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
    pendingChecks: mockChecks.filter(c => c.status === 'pending').reduce((acc, c) => acc + c.amount, 0),
    inventoryValue: mockInventory.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0),
    unpaidInvoices: mockInvoices.filter(i => i.status === 'unpaid' || i.status === 'overdue').reduce((acc, i) => acc + i.amount, 0),
};

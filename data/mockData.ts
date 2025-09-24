
import { Transaction, TransactionType, Check, CheckType, CheckStatus, Product } from '../types';

const today = new Date();
const getDate = (daysOffset: number) => new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const mockTransactions: Transaction[] = [
    { id: 1, type: TransactionType.INCOME, category: "حقوق", description: "حقوق ماهانه", amount: 50000000, date: getDate(-30) },
    { id: 2, type: TransactionType.EXPENSE, category: "اجاره", description: "اجاره خانه", amount: 15000000, date: getDate(-28) },
    { id: 3, type: TransactionType.EXPENSE, category: "غذا", description: "خرید از فروشگاه", amount: 2500000, date: getDate(-25) },
    { id: 4, type: TransactionType.INCOME, category: "فروش", description: "فروش پروژه", amount: 12000000, date: getDate(-15) },
    { id: 5, type: TransactionType.EXPENSE, category: "حمل و نقل", description: "بنزین", amount: 500000, date: getDate(-10) },
    { id: 6, type: TransactionType.EXPENSE, category: "غذا", description: "رستوران", amount: 800000, date: getDate(-5) },
    { id: 7, type: TransactionType.INCOME, category: "حقوق", description: "حقوق ماهانه", amount: 50000000, date: getDate(0) },
    { id: 8, type: TransactionType.EXPENSE, category: "قبوض", description: "پرداخت قبض برق", amount: 750000, date: getDate(-2) },
];

export const mockChecks: Check[] = [
    { id: 1, type: CheckType.OUTGOING, payee: "صاحبخانه", amount: 15000000, dueDate: getDate(2), status: CheckStatus.PENDING, description: "چک اجاره" },
    { id: 2, type: CheckType.INCOMING, payee: "شرکت توسعه وب", amount: 25000000, dueDate: getDate(10), status: CheckStatus.PENDING, description: "پیش پرداخت پروژه" },
    { id: 3, type: CheckType.INCOMING, payee: "فروشگاه آنلاین", amount: 8000000, dueDate: getDate(-5), status: CheckStatus.CASHED, description: "فروش کالا" },
    { id: 4, type: CheckType.OUTGOING, payee: "فروشگاه قطعات", amount: 4500000, dueDate: getDate(20), status: CheckStatus.PENDING, description: "خرید قطعات" },
    { id: 5, type: CheckType.INCOMING, payee: "کارفرما", amount: 10000000, dueDate: getDate(-40), status: CheckStatus.BOUNCED, description: "چک برگشتی" },
];

export const mockProducts: Product[] = [
    { id: 1, name: "لپتاپ مدل X", barcode: "1234567890123", stock: 15, price: 35000000 },
    { id: 2, name: "موس بی سیم", barcode: "2345678901234", stock: 50, price: 800000 },
    { id: 3, name: "کیبورد مکانیکی", barcode: "3456789012345", stock: 30, price: 2500000 },
    { id: 4, name: "مانیتور 27 اینچ", barcode: "4567890123456", stock: 10, price: 12000000 },
];

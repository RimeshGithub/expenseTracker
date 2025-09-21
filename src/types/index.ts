export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'expense' | 'income';
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CategorySummary {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categorySummary: CategorySummary[];
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Bills',
  'Shopping',
  'Health',
  'Education',
  'Other'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Investment',
  'Gift',
  'Other'
];
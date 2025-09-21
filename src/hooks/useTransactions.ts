import { useState, useEffect } from 'react';
import { Transaction, Summary, CategorySummary } from '../types';
import { TransactionService } from '../services/transactionService';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
    
    const subscription = TransactionService.subscribeToTransactions((newTransactions) => {
      setTransactions(newTransactions);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await TransactionService.getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await TransactionService.addTransaction(transaction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      await TransactionService.updateTransaction(id, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await TransactionService.deleteTransaction(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getSummary = (): Summary => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const categoryTotals = transactions.reduce((acc, transaction) => {
      const key = `${transaction.type}-${transaction.category}`;
      acc[key] = (acc[key] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const categorySummary: CategorySummary[] = Object.entries(categoryTotals).map(([key, amount]) => {
      const [type, category] = key.split('-');
      const total = type === 'expense' ? totalExpenses : totalIncome;
      return {
        category: `${category} (${type})`,
        amount,
        count: transactions.filter(t => t.type === type && t.category === category).length,
        percentage: total > 0 ? (amount / total) * 100 : 0
      };
    });

    return {
      totalIncome,
      totalExpenses,
      balance,
      categorySummary
    };
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary,
    refreshTransactions: loadTransactions
  };
}
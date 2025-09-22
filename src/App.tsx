import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import { AuthForm } from './components/Auth/AuthForm';
import { AuthGuard } from './components/Auth/AuthGuard';
import { Header } from './components/Layout/Header';
import { Summary } from './components/Dashboard/Summary';
import { TransactionForm } from './components/Forms/TransactionForm';
import { TransactionList } from './components/Transactions/TransactionList';
import { ExpenseCharts } from './components/Charts/ExpenseCharts';
import { LoadingSpinner } from './components/Loading/LoadingSpinner';
import { ErrorMessage } from './components/Error/ErrorMessage';
import { Transaction } from './types';

function App() {
  const {
    user,
    loading: authLoading,
    error: authError,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    clearError,
    isAuthenticated,
  } = useAuth();

  const {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary,
    refreshTransactions
  } = useTransactions();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Show auth form if user is not authenticated
  if (!isAuthenticated) {
    return (
      <AuthForm
        mode={authMode}
        onSubmit={authMode === 'signin' ? signIn : signUp}
        onGoogleSignIn={signInWithGoogle}
        onModeChange={setAuthMode}
        onForgotPassword={resetPassword}
        loading={authLoading}
        error={authError}
      />
    );
  }

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
        setEditingTransaction(null);
      } else {
        await addTransaction(transactionData);
      }
      setIsFormOpen(false);
    } catch (error) {
      // Error is already handled in the hook
      console.error('Transaction operation failed:', error);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        // Error is already handled in the hook
        console.error('Delete operation failed:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshTransactions} />;
  }

  const summary = getSummary();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header
          totalIncome={summary.totalIncome}
          totalExpenses={summary.totalExpenses}
          balance={summary.balance}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Summary summary={summary} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <TransactionList
                transactions={transactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>

            <div className="space-y-8">
              <ExpenseCharts categorySummary={summary.categorySummary} />
            </div>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors hover:scale-105 transform"
          >
            <Plus className="h-6 w-6" />
          </button>

          <TransactionForm
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={handleAddTransaction}
            editingTransaction={editingTransaction}
          />
        </main>
      </div>
    </AuthGuard>
  );
}

export default App;
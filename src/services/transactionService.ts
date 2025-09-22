import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

export class TransactionService {
  static async getTransactions(): Promise<Transaction[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Error fetching transactions: ${error.message}`);
    }

    return data || [];
  }

  static async addTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: user.id }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error adding transaction: ${error.message}`);
    }

    return data;
  }

  static async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating transaction: ${error.message}`);
    }

    return data;
  }

  static async deleteTransaction(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Error deleting transaction: ${error.message}`);
    }
  }

  static subscribeToTransactions(callback: (transactions: Transaction[]) => void) {
    const subscription = supabase
      .channel('transactions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' },
        async (payload) => {
          // Only refresh if the change affects the current user
          const { data: { user } } = await supabase.auth.getUser();
          if (user && payload.new && payload.new.user_id === user.id) {
            this.getTransactions().then(callback);
          } else if (user && payload.old && payload.old.user_id === user.id) {
            this.getTransactions().then(callback);
          }
        }
      )
      .subscribe();

    return subscription;
  }
}
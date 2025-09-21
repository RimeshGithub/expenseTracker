import React from 'react';
import { Edit2, Trash2, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { Transaction } from '../../types';
import { format, parseISO } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const isExpense = transaction.type === 'expense';
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-full ${
              isExpense ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <DollarSign className={`h-4 w-4 ${
                isExpense ? 'text-red-600' : 'text-green-600'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-semibold ${
                  isExpense ? 'text-red-900' : 'text-green-900'
                }`}>
                  {isExpense ? '-' : '+'}${transaction.amount.toFixed(2)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isExpense 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {transaction.type}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <Tag className="h-4 w-4" />
              <span className="text-sm">{transaction.category}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {format(parseISO(transaction.date), 'MMM dd, yyyy')}
              </span>
            </div>
            
            {transaction.notes && (
              <div className="flex items-start space-x-2 text-gray-600">
                <FileText className="h-4 w-4 mt-0.5" />
                <span className="text-sm">{transaction.notes}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
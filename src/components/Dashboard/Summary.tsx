import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { Summary as SummaryType } from '../../types';

interface SummaryProps {
  summary: SummaryType;
}

export function Summary({ summary }: SummaryProps) {
  const { totalIncome, totalExpenses, balance, categorySummary } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Total Income</p>
            <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium">Total Expenses</p>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
          </div>
          <TrendingDown className="h-8 w-8 text-red-200" />
        </div>
      </div>

      <div className={`bg-gradient-to-r ${
        balance >= 0 
          ? 'from-blue-500 to-blue-600' 
          : 'from-orange-500 to-orange-600'
      } rounded-lg p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${
              balance >= 0 ? 'text-blue-100' : 'text-orange-100'
            }`}>Balance</p>
            <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
          </div>
          <DollarSign className={`h-8 w-8 ${
            balance >= 0 ? 'text-blue-200' : 'text-orange-200'
          }`} />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Categories</p>
            <p className="text-2xl font-bold">{categorySummary.length}</p>
          </div>
          <CreditCard className="h-8 w-8 text-purple-200" />
        </div>
      </div>
    </div>
  );
}
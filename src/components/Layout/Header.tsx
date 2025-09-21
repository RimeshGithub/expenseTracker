import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface HeaderProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export function Header({ totalIncome, totalExpenses, balance }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="bg-blue-600 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
              <p className="text-gray-600">Manage your finances efficiently</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-700 font-medium">Income</p>
                  <p className="text-lg font-bold text-green-900">${totalIncome.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 px-4 py-3 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-red-700 font-medium">Expenses</p>
                  <p className="text-lg font-bold text-red-900">${totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className={`px-4 py-3 rounded-lg border ${
              balance >= 0 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center space-x-2">
                <DollarSign className={`h-5 w-5 ${
                  balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    balance >= 0 ? 'text-blue-700' : 'text-orange-700'
                  }`}>Balance</p>
                  <p className={`text-lg font-bold ${
                    balance >= 0 ? 'text-blue-900' : 'text-orange-900'
                  }`}>${balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
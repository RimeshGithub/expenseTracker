import React from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { CategorySummary } from '../../types';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ExpenseChartsProps {
  categorySummary: CategorySummary[];
}

export function ExpenseCharts({ categorySummary }: ExpenseChartsProps) {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

  const pieData = {
    labels: categorySummary.map(item => item.category),
    datasets: [
      {
        data: categorySummary.map(item => item.amount),
        backgroundColor: colors.slice(0, categorySummary.length),
        borderColor: colors.slice(0, categorySummary.length).map(color => color + '80'),
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const barData = {
    labels: categorySummary.map(item => item.category),
    datasets: [
      {
        label: 'Amount ($)',
        data: categorySummary.map(item => item.amount),
        backgroundColor: colors.slice(0, categorySummary.length).map(color => color + '80'),
        borderColor: colors.slice(0, categorySummary.length),
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || context.raw;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      },
    },
  };

  const barOptions = {
    ...options,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(0);
          }
        }
      },
    },
  };

  if (categorySummary.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No data available for charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
        <div className="h-80">
          <Pie data={pieData} options={options} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Comparison</h3>
        <div className="h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
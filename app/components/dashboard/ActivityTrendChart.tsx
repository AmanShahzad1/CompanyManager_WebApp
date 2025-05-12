// components/activity/ActivityTrendChart.tsx
'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityTrend {
  date: string;
  count: number;
  amount: number;
}

export const ActivityTrendChart = ({ data }: { data: ActivityTrend[] }) => {
  // Properly typed chart data
  const chartData: ChartData<'bar'> = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Activities',
        data: data.map(item => item.count),
        backgroundColor: '#8884d8',
        yAxisID: 'y',
      },
      {
        label: 'Amount ($)',
        data: data.map(item => item.amount),
        backgroundColor: '#82ca9d',
        yAxisID: 'y1',
      },
    ],
  };

  // Properly typed chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${context.datasetIndex === 0 ? value : `$${value.toLocaleString()}`}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Activities'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Amount ($)'
        },
        ticks: {
          callback: (value) => `$${Number(value).toLocaleString()}`
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-semibold mb-4">Activity Trend</h2>
      <div className="h-64">
        <Bar 
          options={options} 
          data={chartData} 
          redraw={true}
        />
      </div>
    </div>
  );
};
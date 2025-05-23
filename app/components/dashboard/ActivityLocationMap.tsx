'use client';

import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { fetchActivitiesByLocation } from '@/api/activities';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { PeriodOption } from '@/types/activity';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityLocationMapProps {
  period: PeriodOption;
  onPeriodChange?: (period: PeriodOption) => void;
}

export default function ActivityLocationMap({ period, onPeriodChange }: ActivityLocationMapProps) {
  const [data, setData] = useState<{location: string; count: number; revenue: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localPeriod, setLocalPeriod] = useState<PeriodOption>(period);

  // Sync local period with prop
  useEffect(() => {
    setLocalPeriod(period);
  }, [period]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchActivitiesByLocation(localPeriod);
        setData(result);
      } catch (err) {
        setError('Failed to load location data');
        console.error('Error loading location data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [localPeriod]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value as PeriodOption;
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    } else {
      setLocalPeriod(newPeriod);
    }
  };

  const chartData = {
    labels: data.map(item => item.location),
    datasets: [
      {
        label: 'Activities',
        data: data.map(item => item.count),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Revenue ($)',
        data: data.map(item => item.revenue),
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1,
        borderRadius: 4,
        xAxisID: 'x1'
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.x;
            return context.datasetIndex === 1 
              ? `${label}: $${value.toLocaleString()}`
              : `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        position: 'bottom',
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1
        },
        title: {
          display: true,
          text: 'Number of Activities'
        }
      },
      x1: {
        position: 'top',
        ticks: {
          callback: (value) => `$${Number(value).toLocaleString()}`
        },
        title: {
          display: true,
          text: 'Revenue ($)'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Activity by Location</h2>
          <select
            disabled
            className="bg-gray-100 border rounded px-3 py-1 text-sm text-gray-400"
          >
            <option>Loading...</option>
          </select>
        </div>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <div className="text-gray-500">Loading location data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Activity by Location</h2>
          <select
            value={onPeriodChange ? period : localPeriod}
            onChange={handlePeriodChange}
            className="bg-white border rounded px-3 py-1 text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-red-500">
          {error}
          <button 
            onClick={() => window.location.reload()}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Activity by Location</h2>
        <select
          value={onPeriodChange ? period : localPeriod}
          onChange={handlePeriodChange}
          className="bg-white border rounded px-3 py-1 text-sm"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>
      <div className="h-64">
        <Bar 
          options={options} 
          data={chartData}
          redraw={true}
        />
      </div>
    </div>
  );
}
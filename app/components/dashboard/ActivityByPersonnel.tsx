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
import { useEffect, useState } from 'react';
import { fetchActivitiesByPersonnel, PersonnelActivity } from '@/api/activities';
import { PeriodOption } from "../../../types/activity";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityByPersonnelProps {
  period: PeriodOption;
  onPeriodChange?: (period: PeriodOption) => void;
}

export default function ActivityByPersonnel({ period, onPeriodChange }: ActivityByPersonnelProps) {
  const [data, setData] = useState<PersonnelActivity[]>([]);
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
        const result = await fetchActivitiesByPersonnel(localPeriod);
        setData(result);
      } catch (err) {
        setError('Failed to load personnel activity data');
        console.error('Error loading data:', err);
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

  // Sort data by count for better visualization
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  const chartData: ChartData<'bar'> = {
    labels: sortedData.map(item => item.name),
    datasets: [
      {
        label: 'Activities',
        data: sortedData.map(item => item.count),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
        borderRadius: 4,
      }
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Activities: ${context.parsed.x}`
        }
      },
      title: { display: false }
    },
    scales: {
      x: {
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
      y: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Activities by Personnel</h2>
        <select
          value={onPeriodChange ? period : localPeriod}
          onChange={handlePeriodChange}
          disabled={loading}
          className={`bg-white border rounded px-3 py-1 text-sm ${loading ? 'bg-gray-100 text-gray-400' : ''}`}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : (
        <div className="h-64">
          <Bar 
            options={options} 
            data={chartData}
            redraw={true}
          />
        </div>
      )}
    </div>
  );
}
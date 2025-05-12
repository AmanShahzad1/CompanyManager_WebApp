// components/activity/ActivityByPersonnel.tsx
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

interface PersonnelActivity {
  name: string;
  count: number;
}

export default function ActivityByPersonnel({ data }: { data: PersonnelActivity[] }) {
  // Sort data by count for better visualization
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // Properly typed chart data
  const chartData: ChartData<'bar'> = {
    labels: sortedData.map(item => item.name),
    datasets: [
      {
        label: 'Activities',
        data: sortedData.map(item => item.count),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
        borderRadius: 4, // Rounded bars
      }
    ],
  };

  // Properly typed chart options
  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const, // Makes it horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend for single dataset
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Activities: ${context.parsed.x}`;
          }
        }
      },
      title: {
        display: false // We're using our own title
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Activities'
        }
      },
      y: {
        grid: {
          display: false // Cleaner look for names
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-semibold mb-4">Activities by Personnel</h2>
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
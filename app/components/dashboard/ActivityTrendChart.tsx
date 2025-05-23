"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { fetchActivityTrends } from "@/api/activities";
import { PeriodOption } from "@/types/activity";

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

interface ActivityTrendChartProps {
  period: PeriodOption;
  onPeriodChange?: (period: PeriodOption) => void;
}

export default function ActivityTrendChart({ 
  period,
  onPeriodChange 
}: ActivityTrendChartProps) {
  const [data, setData] = useState<ActivityTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localPeriod, setLocalPeriod] = useState<PeriodOption>(period);

  // Sync local period with prop
  useEffect(() => {
    setLocalPeriod(period);
  }, [period]);

  useEffect(() => {
    const fetchTrendData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchActivityTrends(localPeriod);
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [localPeriod]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value as PeriodOption;
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    } else {
      setLocalPeriod(newPeriod);
    }
  };

  const chartData: ChartData<"bar"> = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Activities",
        data: data.map((item) => item.count),
        backgroundColor: "#8884d8",
        yAxisID: "y",
      },
      {
        label: "Amount ($)",
        data: data.map((item) => item.amount),
        backgroundColor: "#82ca9d",
        yAxisID: "y1",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${
              context.datasetIndex === 0 ? value : `$${value.toLocaleString()}`
            }`;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Activities",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Amount ($)",
        },
        ticks: {
          callback: (value) => `$${Number(value).toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Activity Trend</h2>
        <select
          value={onPeriodChange ? period : localPeriod}
          onChange={handlePeriodChange}
          disabled={loading}
          className={`bg-white border rounded px-3 py-1 text-sm ${loading ? 'bg-gray-100 text-gray-400' : ''}`}
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
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
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">No data available for the selected period</div>
        </div>
      ) : (
        <div className="h-64">
          <Bar options={options} data={chartData} redraw={true} />
        </div>
      )}
    </div>
  );
}
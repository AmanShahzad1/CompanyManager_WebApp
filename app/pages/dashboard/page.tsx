'use client';

import { useEffect, useState } from 'react';
import ActivitySidebar from "../../components/dashboard/Sidebar";
import ActivityStats from "../../components/dashboard/ActivityStats";
import ActivityTrendChart from "../../components/dashboard/ActivityTrendChart";
import ActivityTable from "../../components/dashboard/ActivityTable";
import ActivityLocationMap from "../../components/dashboard/ActivityLocationMap";
import ActivityByPersonnel from "../../components/dashboard/ActivityByPersonnel";

export default function ActivityLogPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    // Set loading to false after components mount
    // Components will handle their own loading states
    setLoading(false);
  }, []);

  if (loading) return <LoadingActivity />;
  if (error) return <ErrorActivity error={error} />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ActivitySidebar />
      
      <main className="flex-1 p-6 ml-64">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Activity Log Dashboard</h1>
          <div className="flex items-center gap-4">
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'year')}
              className="bg-white border rounded px-3 py-1 text-sm"
            >
              <option value="week">Last Week</option>
              <option value="month">Last 30 Days</option>
              <option value="year">This Year</option>
            </select>
            <button className="bg-indigo-600 text-white px-4 py-1 rounded text-sm hover:bg-indigo-700">
              Export
            </button>
          </div>
        </header>

        {/* Stats Overview - Pass period prop */}
        <ActivityStats period={period} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ActivityTrendChart period={period} />
          </div>
          <div className="lg:col-span-1">
            <ActivityByPersonnel period={period} />
          </div>
        </div>

        {/* Activity Table - Pass period prop */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <ActivityTable period={period} />
        </div>

        {/* Bottom Row - Pass period prop */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <ActivityLocationMap period={period} />
          
        </div>
      </main>
    </div>
  );
}


function LoadingActivity() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-indigo-900"></div>
      <div className="flex-1 p-6 ml-64">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl"></div>
            <div className="lg:col-span-1 h-64 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

function ErrorActivity({ error }: { error: string }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-indigo-900"></div>
      <div className="flex-1 p-6 ml-64 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
// pages/activity-log.tsx
'use client';

import { useEffect, useState } from 'react';
import ActivitySidebar from "../../components/dashboard/Sidebar";
import ActivityStatsComponent from "../../components/dashboard/ActivityStats";
import {ActivityTrendChart} from "../../components/dashboard/ActivityTrendChart";
import ActivityTable from "../../components/dashboard/ActivityTable";
import ActivityLocationMap from "../../components/dashboard/ActivityLocationMap";
import ActivityByPersonnel from "../../components/dashboard/ActivityByPersonnel";
import { Activity, ActivityStats } from '@/types/activity';

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, fetch from your API or process CSV here
        const mockActivities: Activity[] = await generateMockData();
        
        const stats = calculateStats(mockActivities);
        
        setActivities(mockActivities);
        setStats(stats);

      } catch (err) {
        setError('Failed to load activity data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingActivity />;
  if (error) return <ErrorActivity error={error} />;
  if (!stats) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ActivitySidebar />
      
      <main className="flex-1 p-6 ml-64">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Activity Log Dashboard</h1>
          <div className="flex items-center gap-4">
            <select className="bg-white border rounded px-3 py-1 text-sm">
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
            <button className="bg-indigo-600 text-white px-4 py-1 rounded text-sm hover:bg-indigo-700">
              Export
            </button>
          </div>
        </header>

        <ActivityStatsComponent stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ActivityTrendChart 
              data={generateTrendData(activities)} 
            />
          </div>
          <div className="lg:col-span-1">
            <ActivityByPersonnel 
              data={generatePersonnelData(activities)} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <ActivityTable activities={activities.slice(0, 10)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityLocationMap />
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-4">Pending Actions</h2>
            {/* Add pending actions component */}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper functions for data processing
function generateMockData(): Activity[] {
  // Replace this with actual CSV processing
  return [...Array(20)].map((_, i) => ({
    id: i + 1,
    endUser: `Client ${i % 3 + 1}`,
    customerName: `Customer ${String.fromCharCode(65 + (i % 5))}`,
    vendorName: `Vendor ${i % 4 + 1}`,
    workLocation: ['New York', 'London', 'Tokyo', 'Sydney'][i % 4],
    personnel: ['John Doe', 'Jane Smith', 'Mike Johnson'][i % 3],
    activity: ['Installation', 'Maintenance', 'Inspection', 'Repair'][i % 4],
    activityDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    activityCompleted: Math.random() > 0.3,
    poStatus: ['Approved', 'Pending', 'Rejected'][i % 3],
    invoiced: Math.random() > 0.4,
    invoiceNumber: Math.random() > 0.4 ? `INV-2023-${1000 + i}` : undefined,
    paymentStatus: ['Paid', 'Pending', 'Overdue'][i % 3],
    reportsPending: Math.random() > 0.7,
    charges: Math.floor(Math.random() * 5000) + 500
  }));
}

function calculateStats(activities: Activity[]): ActivityStats {
  return {
    totalActivities: activities.length,
    completedActivities: activities.filter(a => a.activityCompleted).length,
    pendingPayments: activities.filter(a => a.paymentStatus === 'Pending').length,
    overduePayments: activities.filter(a => a.paymentStatus === 'Overdue').length,
    totalCharges: activities.reduce((sum, a) => sum + a.charges, 0),
    pendingReports: activities.filter(a => a.reportsPending).length
  };
}

function generateTrendData(activities: Activity[]): any {
  // Implement your trend data generation
  return [...Array(7)].map((_, i) => ({
    date: `Day ${i + 1}`,
    count: Math.floor(Math.random() * 10) + 2,
    amount: Math.floor(Math.random() * 20000) + 5000
  }));
}

function generatePersonnelData(activities: Activity[]): any {
  // Implement your personnel data generation
  return [...Array(5)].map((_, i) => ({
    name: `Person ${i + 1}`,
    count: Math.floor(Math.random() * 20) + 5
  }));
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
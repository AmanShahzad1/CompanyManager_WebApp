import { useEffect, useState } from 'react';
import { fetchActivityStats } from '@/api/activities';
import { PeriodOption } from '@/types/activity';

interface StatConfig {
  key: string;
  label: string;
  icon: string;
  color: string;
  format?: (value: number) => string;
}

const statConfigs: StatConfig[] = [
  {
    key: 'total_activities',
    label: 'Total Activities',
    icon: '📋',
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    key: 'completed_activities',
    label: 'Completed',
    icon: '✅',
    color: 'bg-green-100 text-green-800'
  },
  {
    key: 'pending_payments',
    label: 'Pending Payments',
    icon: '⏳',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    key: 'overdue_payments',
    label: 'Overdue',
    icon: '⚠️',
    color: 'bg-red-100 text-red-800'
  },
  {
    key: 'total_charges',
    label: 'Total Charges',
    icon: '💰',
    color: 'bg-purple-100 text-purple-800',
    format: (value: number) => `$${value.toLocaleString()}`
  },
  {
    key: 'pending_reports',
    label: 'Pending Reports',
    icon: '📝',
    color: 'bg-blue-100 text-blue-800'
  }
];

interface ActivityStatsProps {
  period?: PeriodOption; // Only added this line
}

export default function ActivityStats({ period }: ActivityStatsProps) { // Added period prop
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const statsData = await fetchActivityStats(); // No changes to API call
        setStats(statsData);
      } catch (err) {
        setError('Failed to load activity statistics');
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
    
    // Optional: Refresh stats every 5 minutes
    const interval = setInterval(loadStats, 300000);
    return () => clearInterval(interval);
  }, []); // No period in dependencies

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statConfigs.map((config) => (
          <div key={config.key} className={`rounded-xl shadow p-4 ${config.color} animate-pulse`}>
            <div className="h-10 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl shadow p-4 bg-red-100 text-red-800 mb-6">
        <div className="flex items-center">
          <div className="text-2xl mr-3">❌</div>
          <div>
            <div className="text-lg font-bold">{error}</div>
            <div className="text-sm">Please try again later</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statConfigs.map((config) => {
        const value = stats[config.key] || 0;
        return (
          <div key={config.key} className={`rounded-xl shadow p-4 flex items-center ${config.color}`}>
            <div className="text-2xl mr-3">{config.icon}</div>
            <div>
              <div className="text-xs font-medium">{config.label}</div>
              <div className="text-lg font-bold">
                {config.format ? config.format(value as number) : value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
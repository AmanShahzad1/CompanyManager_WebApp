// components/activity/ActivityStats.tsx
import { ActivityStats } from '@/types/activity';

const statConfigs = [
  {
    key: 'totalActivities',
    label: 'Total Activities',
    icon: '📋',
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    key: 'completedActivities',
    label: 'Completed',
    icon: '✅',
    color: 'bg-green-100 text-green-800'
  },
  {
    key: 'pendingPayments',
    label: 'Pending Payments',
    icon: '⏳',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    key: 'overduePayments',
    label: 'Overdue',
    icon: '⚠️',
    color: 'bg-red-100 text-red-800'
  },
  {
    key: 'totalCharges',
    label: 'Total Charges',
    icon: '💰',
    color: 'bg-purple-100 text-purple-800',
    format: (value: number) => `$${value.toLocaleString()}`
  },
  {
    key: 'pendingReports',
    label: 'Pending Reports',
    icon: '📝',
    color: 'bg-blue-100 text-blue-800'
  }
];

export default function ActivityStatsComponent({ stats }: { stats: ActivityStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statConfigs.map((config) => {
        const value = stats[config.key as keyof ActivityStats];
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
// components/activity/ActivityTable.tsx
import { Activity } from '@/types/activity';
import Link from 'next/link';

const statusColors = {
  Paid: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Overdue: 'bg-red-100 text-red-800'
};

export default function ActivityTable({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold">Recent Activities</h2>
        <div className="flex gap-2">
          <select className="bg-white border rounded px-3 py-1 text-sm">
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
          <select className="bg-white border rounded px-3 py-1 text-sm">
            <option>All Personnel</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="p-3 text-left min-w-[180px]">Customer/End User</th>
              <th className="p-3 text-left min-w-[200px]">Activity/Vendor</th>
              <th className="p-3 text-left min-w-[120px]">Location</th>
              <th className="p-3 text-left min-w-[120px]">Personnel</th>
              <th className="p-3 text-left min-w-[100px]">Date</th>
              <th className="p-3 text-right min-w-[100px]">Charges</th>
              <th className="p-3 text-left min-w-[120px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <Link href={`/customers/${activity.customerName}`} className="font-medium block">
                    {activity.customerName}
                  </Link>
                  <div className="text-xs text-gray-500">{activity.endUser}</div>
                </td>
                <td className="p-3">
                  <div className="font-medium">{activity.activity}</div>
                  <div className="text-xs text-gray-500">{activity.vendorName}</div>
                </td>
                <td className="p-3">{activity.workLocation}</td>
                <td className="p-3">{activity.personnel}</td>
                <td className="p-3">
                  {new Date(activity.activityDate).toLocaleDateString()}
                  {activity.reportsPending && (
                    <span className="ml-1 text-xs bg-red-100 text-red-800 px-1 rounded">Report</span>
                  )}
                </td>
                <td className="p-3 text-right font-medium">
                  ${activity.charges.toLocaleString()}
                </td>
                <td className="p-3">
                  {/* <span className={`px-2 py-1 rounded-full text-xs ${statusColors[activity.paymentStatus]}`}>
                    {activity.paymentStatus}
                  </span> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
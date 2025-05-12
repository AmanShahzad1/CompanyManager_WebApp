// components/activity/ActivitySidebar.tsx
import Link from 'next/link';

export default function ActivitySidebar() {
  return (
    <aside className="w-64 bg-indigo-900 text-white p-6 space-y-6 fixed h-full">
      <h2 className="text-2xl font-bold">Activity Tracker</h2>
      <nav className="space-y-4 text-sm" aria-label="Main navigation">
        <Link href="/activity-log" className="block hover:text-gray-200 font-medium">Dashboard</Link>
        <Link href="/activity-log/entries" className="block hover:text-gray-200">Activity Entries</Link>
        <Link href="/activity-log/customers" className="block hover:text-gray-200">Customers</Link>
        <Link href="/activity-log/vendors" className="block hover:text-gray-200">Vendors</Link>
        <Link href="/activity-log/reports" className="block hover:text-gray-200">Reports</Link>
        <div className="pt-4 border-t border-indigo-800">
          <Link href="/activity-log/settings" className="block hover:text-gray-200">Settings</Link>
        </div>
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="text-xs text-indigo-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </aside>
  );
}
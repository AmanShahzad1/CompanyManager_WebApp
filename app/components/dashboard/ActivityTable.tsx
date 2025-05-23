import { useState, useEffect } from 'react';
import { 
  fetchActivities, 
  updateActivity, 
  deleteActivity,
  fetchPersonnelOptions,
  createActivity
} from '../../../api/activities';
import { Activity, PeriodOption } from '@/types/activity';

const paymentStatusColors = {
  Paid: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Overdue: 'bg-red-100 text-red-800'
};

const activityStatusColors = {
  Completed: 'bg-blue-100 text-blue-800',
  Pending: 'bg-orange-100 text-orange-800'
};

interface ActivityTableProps {
  period?: PeriodOption; // Only added this line
}

const initialFormState: Omit<Activity, 'id'> = {
  end_user: '',
  customer_name: '',
  vendor_name: '',
  work_location: '',
  personnel: '',
  activity: '',
  activity_date: new Date().toISOString().split('T')[0],
  activity_completed: false,
  po_status: 'Pending',
  invoiced: false,
  invoice_number: '',
  payment_status: 'Pending',
  reports_pending: false,
  charges: 0
};

export default function ActivityTable({ period }: ActivityTableProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [personnelOptions, setPersonnelOptions] = useState<string[]>(['All Personnel']);
  const [filters, setFilters] = useState({
    status: '',
    personnel: ''
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [activitiesData, personnelData] = await Promise.all([
          fetchActivities(filters),
          fetchPersonnelOptions()
        ]);
        setActivities(activitiesData);
        setPersonnelOptions(['All Personnel', ...personnelData]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!newActivity.customer_name) errors.customer_name = 'Customer name is required';
    if (!newActivity.vendor_name) errors.vendor_name = 'Vendor name is required';
    if (!newActivity.activity) errors.activity = 'Activity is required';
    if (!newActivity.personnel) errors.personnel = 'Personnel is required';
    if (!newActivity.activity_date) errors.activity_date = 'Date is required';
    if (newActivity.charges === null || isNaN(Number(newActivity.charges))) {
      errors.charges = 'Valid charges are required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewActivity(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddActivity = async () => {
    if (!validateForm()) return;
    
    try {
      const createdActivity = await createActivity(newActivity);
      setActivities(prev => [createdActivity, ...prev]);
      setShowAddModal(false);
      setNewActivity(initialFormState);
    } catch (error) {
      console.error('Error creating activity:', error);
      alert('Failed to create activity');
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };

  const handlePersonnelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      personnel: e.target.value === 'All Personnel' ? '' : e.target.value
    }));
  };

  const handleToggleComplete = async (id: number, currentStatus: boolean) => {
    try {
      const updatedActivity = await updateActivity(id, {
        activity_completed: !currentStatus
      });
      setActivities(prev => 
        prev.map(activity => 
          activity.id === id ? updatedActivity : activity
        )
      );
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('Failed to update activity');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    try {
      await deleteActivity(id);
      setActivities(prev => prev.filter(activity => activity.id !== id));
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity');
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold">Activities</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Add Activity
          </button>
          <select 
            className="bg-white border rounded px-3 py-1 text-sm"
            value={filters.status}
            onChange={handleStatusChange}
          >
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <select 
            className="bg-white border rounded px-3 py-1 text-sm"
            value={filters.personnel || 'All Personnel'}
            onChange={handlePersonnelChange}
          >
            {personnelOptions.map(personnel => (
              <option key={personnel} value={personnel}>
                {personnel}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="p-3 text-left">Customer/End User</th>
              <th className="p-3 text-left">Activity/Vendor</th>
              <th className="p-3 text-left">Work Location</th>
              <th className="p-3 text-left">Assigned Personnel</th>
              <th className="p-3 text-left">Activity Date</th>
              <th className="p-3 text-right">Service Charges</th>
              <th className="p-3 text-left">Payment Status</th>
              <th className="p-3 text-left">Activity Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="font-medium">{activity.customer_name}</div>
                  <div className="text-xs text-gray-500">{activity.end_user}</div>
                </td>
                <td className="p-3">
                  <div className="font-medium">{activity.activity}</div>
                  <div className="text-xs text-gray-500">{activity.vendor_name}</div>
                </td>
                <td className="p-3">{activity.work_location}</td>
                <td className="p-3">{activity.personnel}</td>
                <td className="p-3">
                  {new Date(activity.activity_date).toLocaleDateString()}
                </td>
                <td className="p-3 text-right font-medium">
                  ${typeof activity.charges === 'string' ? 
                    parseFloat(activity.charges).toLocaleString() : 
                    activity.charges.toLocaleString()}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    paymentStatusColors[activity.payment_status as keyof typeof paymentStatusColors] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.payment_status}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activityStatusColors[activity.activity_completed ? 'Completed' : 'Pending']
                  }`}>
                    {activity.activity_completed ? 'Completed' : 'Pending'}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleToggleComplete(activity.id, activity.activity_completed)}
                    className={`text-xs px-2 py-1 rounded ${
                      activity.activity_completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {activity.activity_completed ? 'Completed' : 'Mark Done'}
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="text-xs px-2 py-1 rounded bg-red-100 text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Add New Activity</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name*</label>
                <input
                  type="text"
                  name="customer_name"
                  value={newActivity.customer_name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${formErrors.customer_name ? 'border-red-500' : ''}`}
                />
                {formErrors.customer_name && <p className="text-red-500 text-xs mt-1">{formErrors.customer_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End User</label>
                <input
                  type="text"
                  name="end_user"
                  value={newActivity.end_user}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name*</label>
                <input
                  type="text"
                  name="vendor_name"
                  value={newActivity.vendor_name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${formErrors.vendor_name ? 'border-red-500' : ''}`}
                />
                {formErrors.vendor_name && <p className="text-red-500 text-xs mt-1">{formErrors.vendor_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
                <input
                  type="text"
                  name="work_location"
                  value={newActivity.work_location}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personnel*</label>
                <select
                  name="personnel"
                  value={newActivity.personnel}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${formErrors.personnel ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Personnel</option>
                  {personnelOptions.filter(p => p !== 'All Personnel').map(personnel => (
                    <option key={personnel} value={personnel}>{personnel}</option>
                  ))}
                </select>
                {formErrors.personnel && <p className="text-red-500 text-xs mt-1">{formErrors.personnel}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity*</label>
                <input
                  type="text"
                  name="activity"
                  value={newActivity.activity}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${formErrors.activity ? 'border-red-500' : ''}`}
                />
                {formErrors.activity && <p className="text-red-500 text-xs mt-1">{formErrors.activity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Date*</label>
                <input
                  type="date"
                  name="activity_date"
                  value={newActivity.activity_date}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${formErrors.activity_date ? 'border-red-500' : ''}`}
                />
                {formErrors.activity_date && <p className="text-red-500 text-xs mt-1">{formErrors.activity_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Charges*</label>
                <input
                  type="number"
                  name="charges"
                  value={newActivity.charges}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${formErrors.charges ? 'border-red-500' : ''}`}
                  step="0.01"
                />
                {formErrors.charges && <p className="text-red-500 text-xs mt-1">{formErrors.charges}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PO Status</label>
                <select
                  name="po_status"
                  value={newActivity.po_status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  name="payment_status"
                  value={newActivity.payment_status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="activity_completed"
                  checked={newActivity.activity_completed}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Activity Completed</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="reports_pending"
                  checked={newActivity.reports_pending}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Reports Pending</label>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormErrors({});
                }}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddActivity}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export interface Activity {
  id: number;
  end_user: string;
  customer_name: string;
  vendor_name: string;
  work_location: string;
  personnel: string;
  activity: string;
  activity_date: string;
  activity_completed: boolean;
  po_status: string;
  invoiced: boolean;
  invoice_number?: string | null;
  payment_status: string;
  reports_pending: boolean;
  charges: number | string;
}

// components/dashboard/types.ts
export type PeriodOption = 'week' | 'month' | 'year';

// For filters
export interface ActivityFilters {
  status?: string;
  personnel?: string;
  [key: string]: string | undefined;
}

export interface ActivityStats {
  totalActivities: number;
  completedActivities: number;
  pendingPayments: number;
  totalCharges: number;
  overduePayments: number;
  pendingReports: number;
}

export interface ActivityTrend {
  date: string;
  count: number;
  amount: number;
}
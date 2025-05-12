// types/activity.ts
export interface Activity {
  id: number;
  endUser: string;
  customerName: string;
  vendorName: string;
  workLocation: string;
  personnel: string;
  activity: string;
  activityDate: Date;
  activityCompleted: boolean;
  poStatus: string;
  invoiced: boolean;
  invoiceNumber?: string;
  paymentStatus: string;
  reportsPending: boolean;
  charges: number;
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
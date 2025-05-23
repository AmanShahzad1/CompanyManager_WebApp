import { Activity } from '@/types/activity';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchActivities = async (filters: {
  status?: string;
  personnel?: string;
} = {}): Promise<Activity[]> => {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.personnel) params.append('personnel', filters.personnel);

  const response = await fetch(`${API_URL}/activity?${params.toString()}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch activities');
  }
  return await response.json();
};

export const updateActivity = async (
  id: number, 
  updateData: Partial<Activity>
): Promise<Activity> => {
  const response = await fetch(`${API_URL}/activity/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update activity');
  }
  return await response.json();
};

export const deleteActivity = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/activity/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete activity');
  }
};

export const fetchPersonnelOptions = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/activity/personnel`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch personnel options');
  }
  return await response.json();
};


export const createActivity = async (activityData: Omit<Activity, 'id'>): Promise<Activity> => {
  const response = await fetch(`${API_URL}/activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(activityData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create activity');
  }
  return await response.json();
};


export const fetchActivityStats = async (): Promise<Record<string, number>> => {
  const response = await fetch(`${API_URL}/activity/stats`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch activity statistics');
  }
  return await response.json();
};

export const fetchActivityTrends = async (period: string = 'week'): Promise<ActivityTrend[]> => {
  try {
    const response = await fetch(`${API_URL}/activity/trends?period=${period}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching activity trends:', error);
    throw error;
  }
};

export interface ActivityTrend {
  date: string;
  count: number;
  amount: number;
}

export interface PersonnelActivity {
  name: string;
  count: number;
}

export const fetchActivitiesByPersonnel = async (
  period: string = 'month'
): Promise<PersonnelActivity[]> => {
  const response = await fetch(`${API_URL}/activity/by-personnel?period=${period}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch personnel activity stats');
  }
  return await response.json();
};


export interface LocationActivity {
  location: string;
  count: number;
  revenue: number;
}

export const fetchActivitiesByLocation = async (
  period: string = 'month'
): Promise<LocationActivity[]> => {
  const response = await fetch(`${API_URL}/activity/by-location?period=${period}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch location data');
  }
  return await response.json();
};
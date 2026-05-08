import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ActivityPayload {
  name: string;
  activity: string;
  hours: number;
}

export interface Activity {
  id?: number;
  name: string;
  activity: string;
  hours: number;
}

export interface Summary {
  total_entries: number;
  total_hours: number;
  most_active_user: string;
}

export const addActivity = async (payload: ActivityPayload): Promise<Activity> => {
  const response = await api.post<{message: string, data: Activity}>('/activities', payload);
  return response.data.data;
};

export const getActivities = async (): Promise<Activity[]> => {
  const response = await api.get<{count: number, activities: Activity[]}>('/activities');
  return response.data.activities;
};

export const getSummary = async (): Promise<Summary> => {
  const response = await api.get<Summary>('/summary');
  return response.data;
};

export default api;

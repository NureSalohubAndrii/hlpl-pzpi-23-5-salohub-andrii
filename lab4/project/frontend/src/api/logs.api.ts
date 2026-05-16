import { apiRequest } from './client';

export interface LogEntry {
  id: string;
  method: string;
  path: string;
  statusCode: number | null;
  duration: number | null;
  createdAt: string;
  user: {
    id: string;
    fullName: string | null;
    email: string;
  } | null;
}

export const getLogs = async (limit = 50, offset = 0): Promise<LogEntry[]> => {
  const response = await apiRequest<{ logs: LogEntry[] }>(
    `/logs?limit=${limit}&offset=${offset}`,
    { method: 'GET' }
  );
  return response.logs;
};

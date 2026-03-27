import { useAuthStore } from '../stores/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_URL as string;

interface ApiErrorData {
  message?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  data?: ApiErrorData;

  constructor(status: number, message: string, data?: ApiErrorData) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const processQueue = (newToken: string) => {
  refreshQueue.forEach((resolve) => resolve(newToken));
  refreshQueue = [];
};

const tryRefreshToken = async (): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  const data = (await response.json()) as { accessToken: string };
  return data.accessToken;
};

export const apiRequest = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const { token, setAuth, clearAuth, user } = useAuthStore.getState();

  const buildConfig = (currentToken: string | null): RequestInit => ({
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
      ...options?.headers,
    },
  });

  try {
    const response = await fetch(url, buildConfig(token));
    const data = (await response.json()) as ApiErrorData;

    if (response.status === 401 && endpoint !== '/auth/refresh-token') {
      if (isRefreshing) {
        return new Promise<T>((resolve, reject) => {
          refreshQueue.push(async (newToken: string) => {
            try {
              const retryResponse = await fetch(url, buildConfig(newToken));
              const retryData = await retryResponse.json();
              if (!retryResponse.ok) {
                reject(
                  new ApiError(
                    retryResponse.status,
                    retryData.message || 'Request failed',
                    retryData
                  )
                );
              } else {
                resolve(retryData as T);
              }
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await tryRefreshToken();
        if (user) {
          setAuth(user, newToken);
        }
        processQueue(newToken);

        const retryResponse = await fetch(url, buildConfig(newToken));
        const retryData = (await retryResponse.json()) as ApiErrorData;

        if (!retryResponse.ok) {
          throw new ApiError(
            retryResponse.status,
            (retryData.message as string) || 'Request failed',
            retryData
          );
        }

        return retryData as T;
      } catch {
        clearAuth();
        throw new ApiError(401, 'Session expired. Please log in again.');
      } finally {
        isRefreshing = false;
      }
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        (data.message as string) || 'Request failed',
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error. Please try again.');
  }
};

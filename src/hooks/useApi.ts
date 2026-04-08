import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

/**
 * Generic async state hook for API calls
 * Handles loading, error, and data states with a single hook
 * Usage: const { data, loading, error, execute } = useAsync()
 */
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>(
    'idle'
  );
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  // Execute async function
  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(
        err instanceof Error ? (err.message as unknown as E) : (err as E)
      );
      setStatus('error');
    }
  }, [asyncFunction]);

  // Call on mount if immediate
  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return { execute, status, value, error };
};

/**
 * Hook for authentication
 * Provides user state and auth methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Call authService.login()
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Call authService.logout()
      setUser(null);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  }, []);

  return { user, isLoading, error, login, logout };
};

/**
 * Hook for handling API calls with loading and error states
 * Usage: const { data, loading, error, refetch } = useApi()
 */
export const useApi = <T,>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  // Auto-fetch on mount
  useState(() => {
    refetch();
  });

  return { data, loading, error, refetch };
};

import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useAuth } from './useAuth';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const request = useCallback(async (
    method, 
    endpoint, 
    data = null, 
    options = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      const response = await api(endpoint, config);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    loading,
    error,
    request,
    setError,
  };
};
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { authService } from '../services/auth';
import { Rider, ApiError } from '../types/auth';

interface ActiveRidersResponse {
  success: boolean;
  message: string;
  riders: Rider[];
  summary: {
    total_active_riders: number;
    available_riders: number;
    unavailable_riders: number;
    riders_with_location: number;
  };
  pagination: {
    current_page: number;
    total_pages: number;
    total_riders: number;
    limit: number;
  };
  filters: {
    availability: string;
    search: string | null;
  };
}

interface ActiveRidersState {
  riders: Rider[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date;
}

export const useActiveRiders = () => {
  const [state, setState] = useState<ActiveRidersState>({
    riders: [],
    loading: false,
    error: null,
    lastUpdate: new Date()
  });

  // Fetch active riders function
  const fetchActiveRiders = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Use the specific active riders endpoint
      const response = await apiService.authenticatedRequest<ActiveRidersResponse>(
        '/api/admin/riders/ACTIVE',
        token,
        { method: 'GET' }
      );
      
      if (response.success) {
        setState({
          riders: response.riders || [],
          loading: false,
          error: null,
          lastUpdate: new Date()
        });
        return response;
      } else {
        throw new Error(response.message || 'Failed to fetch active riders');
      }
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Failed to fetch active riders'
      }));
      throw error;
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-refresh every 30 seconds for live tracking
  useEffect(() => {
    // Initial fetch
    fetchActiveRiders();

    // Set up auto-refresh interval
    const interval = setInterval(() => {
      fetchActiveRiders();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchActiveRiders]);

  return {
    ...state,
    fetchActiveRiders,
    clearError,
    refresh: fetchActiveRiders
  };
};

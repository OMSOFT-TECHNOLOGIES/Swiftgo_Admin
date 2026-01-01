import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { authService } from '../services/auth';
import { Rider, RidersFilters, ApiError } from '../types/auth';

interface RidersState {
  riders: Rider[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_riders: number;
    limit: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export const useRiders = () => {
  const [ridersState, setRidersState] = useState<RidersState>({
    riders: [],
    pagination: null,
    loading: false,
    error: null
  });

  // Fetch riders function
  const fetchRiders = useCallback(async (filters: RidersFilters = {}) => {
    setRidersState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiService.getRiders(token, filters);
      
      setRidersState({
        riders: response.riders,
        pagination: response.pagination,
        loading: false,
        error: null
      });

      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setRidersState(prev => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Failed to fetch riders'
      }));
      throw error;
    }
  }, []);

  // Create rider function
  const createRider = useCallback(async (riderData: any): Promise<void> => {
    setRidersState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await apiService.createRider(token, riderData);
      
      // Refresh riders list after creation
      await fetchRiders();
    } catch (error) {
      const apiError = error as ApiError;
      setRidersState(prev => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Failed to create rider'
      }));
      throw error;
    }
  }, [fetchRiders]);

  // Update rider function
  const updateRider = useCallback(async (riderId: string, riderData: any): Promise<void> => {
    setRidersState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await apiService.updateRider(token, riderId, riderData);
      
      // Refresh riders list after update
      await fetchRiders();
    } catch (error) {
      const apiError = error as ApiError;
      setRidersState(prev => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Failed to update rider'
      }));
      throw error;
    }
  }, [fetchRiders]);

  // Delete rider function
  const deleteRider = useCallback(async (riderId: string): Promise<void> => {
    setRidersState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await apiService.deleteRider(token, riderId);
      
      // Refresh riders list after deletion
      await fetchRiders();
    } catch (error) {
      const apiError = error as ApiError;
      setRidersState(prev => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Failed to delete rider'
      }));
      throw error;
    }
  }, [fetchRiders]);

  // Clear error function
  const clearError = useCallback(() => {
    setRidersState(prev => ({ ...prev, error: null }));
  }, []);

  // Initialize - fetch riders on mount
  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  return {
    ...ridersState,
    fetchRiders,
    createRider,
    updateRider,
    deleteRider,
    clearError
  };
};

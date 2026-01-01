import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { PendingRiderApplication, RidersFilters, ApprovalRequest } from '../types/auth';
import { useAuth } from './useAuth';

interface PendingRidersPagination {
  current_page: number;
  total_pages: number;
  total_riders: number;
  limit: number;
}

export function usePendingRiders() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<PendingRiderApplication[]>([]);
  const [pagination, setPagination] = useState<PendingRidersPagination>({
    current_page: 1,
    total_pages: 1,
    total_riders: 0,
    limit: 20
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingRiders = useCallback(async (filters: RidersFilters = {}) => {
    if (!token) {
      setError('No authentication token available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getPendingRiders(token, filters);
      setApplications(response.riders);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error('Error fetching pending riders:', err);
      setError(err.message || 'Failed to fetch pending riders');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const approveApplication = useCallback(async (riderId: string, notes?: string) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const approvalData: ApprovalRequest = {};
    if (notes) {
      approvalData.notes = notes;
    }

    try {
      const response = await apiService.approveRider(token, riderId, approvalData);
      
      // Remove the approved application from the list
      setApplications(prev => prev.filter(app => app.id !== riderId));
      
      // Update pagination count
      setPagination(prev => ({
        ...prev,
        total_riders: Math.max(0, prev.total_riders - 1)
      }));

      return response;
    } catch (err: any) {
      console.error('Error approving rider:', err);
      throw new Error(err.message || 'Failed to approve rider');
    }
  }, [token]);

  const rejectApplication = useCallback(async (riderId: string, notes: string) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await apiService.rejectRider(token, riderId, { notes });
      
      // Remove the rejected application from the list
      setApplications(prev => prev.filter(app => app.id !== riderId));
      
      // Update pagination count
      setPagination(prev => ({
        ...prev,
        total_riders: Math.max(0, prev.total_riders - 1)
      }));

      return response;
    } catch (err: any) {
      console.error('Error rejecting rider:', err);
      throw new Error(err.message || 'Failed to reject rider');
    }
  }, [token]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    applications,
    pagination,
    loading,
    error,
    fetchPendingRiders,
    approveApplication,
    rejectApplication,
    clearError
  };
}

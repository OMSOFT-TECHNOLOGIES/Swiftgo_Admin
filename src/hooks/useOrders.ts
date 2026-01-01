import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { apiService } from '../services/api';
import { Order, OrdersResponse, OrdersFilters } from '../types/auth';
import { toast } from 'sonner';

export const useOrders = (initialFilters: OrdersFilters = {}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<OrdersResponse['summary'] | null>(null);
  const [pagination, setPagination] = useState<OrdersResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrdersFilters>(initialFilters);
  
  const { token } = useAuth();

  const fetchOrders = useCallback(async (newFilters?: OrdersFilters) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const filtersToUse = newFilters || filters;
      const response = await apiService.getOrders(token, filtersToUse);
      
      setOrders(response.orders);
      setSummary(response.summary);
      setPagination(response.pagination);
      
      if (newFilters) {
        setFilters(filtersToUse);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    if (!token) return false;

    try {
      const response = await apiService.updateOrderStatus(token, orderId, status);
      
      // Update the order in the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: status as Order['status'] }
            : order
        )
      );
      
      toast.success(response.message || 'Order status updated successfully');
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update order status';
      toast.error(errorMessage);
      return false;
    }
  }, [token]);

  const refreshOrders = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateFilters = useCallback((newFilters: OrdersFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchOrders({ ...filters, ...newFilters });
  }, [filters, fetchOrders]);

  const resetFilters = useCallback(() => {
    const defaultFilters: OrdersFilters = {
      status: 'all',
      page: 1,
      limit: 20,
      sort_by: 'created_at',
      sort_order: 'DESC'
    };
    setFilters(defaultFilters);
    fetchOrders(defaultFilters);
  }, [fetchOrders]);

  // Load orders on mount
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Derived state for different order categories
  const activeOrders = orders.filter(order => 
    ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(order.status)
  );
  
  const completedOrders = orders.filter(order => order.status === 'DELIVERED');
  const cancelledOrders = orders.filter(order => order.status === 'CANCELLED');
  const pendingOrders = orders.filter(order => order.status === 'PENDING');

  return {
    orders,
    summary,
    pagination,
    loading,
    error,
    filters,
    activeOrders,
    completedOrders,
    cancelledOrders,
    pendingOrders,
    fetchOrders,
    updateOrderStatus,
    refreshOrders,
    updateFilters,
    resetFilters,
    setFilters
  };
};

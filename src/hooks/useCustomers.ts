import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { apiService } from '../services/api';
import { Customer, CustomersResponse, CustomerFilters } from '../types/auth';
import { useAuth } from './useAuth';

export function useCustomers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  console.log('useCustomers - token available:', !!token);
  console.log('useCustomers - token preview:', token ? token.substring(0, 20) + '...' : 'null');
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_users: 0,
    limit: 20
  });
  const [filters, setFilters] = useState<CustomerFilters>({
    status: 'all',
    search: '',
    page: 1,
    limit: 20
  });

  // Fetch customers from API
  const fetchCustomers = async (newFilters?: CustomerFilters) => {
    console.log('fetchCustomers called - token available:', !!token);
    if (!token) {
      console.log('No token available, skipping API call');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Making API call with token preview:', token.substring(0, 20) + '...');
      const filtersToUse = newFilters || filters;
      const response: CustomersResponse = await apiService.getCustomers(token, filtersToUse);

      if (response.success) {
        setCustomers(response.users);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Failed to fetch customers');
        toast.error('Failed to fetch customers');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customers';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update filters and fetch new data
  const updateFilters = (newFilters: Partial<CustomerFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset to page 1 when filtering
    setFilters(updatedFilters);
    fetchCustomers(updatedFilters);
  };

  // Refresh customers data
  const refreshCustomers = () => {
    fetchCustomers();
  };

  // Update customer status
  const updateCustomerStatus = async (customerId: string, status: string) => {
    if (!token) return;

    try {
      const response = await apiService.updateCustomerStatus(token, customerId, status);
      
      if (response.message) {
        // Update local state
        setCustomers(prev => prev.map(customer => 
          customer.id === customerId 
            ? { ...customer, status: status as Customer['status'] }
            : customer
        ));
        
        toast.success(`Customer status updated to ${status}`);
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update customer status';
      toast.error(errorMessage);
      return false;
    }
  };

  // Derived state for different customer categories
  const activeCustomers = useMemo(() => 
    customers.filter(customer => customer.status === 'ACTIVE'), 
    [customers]
  );

  const inactiveCustomers = useMemo(() => 
    customers.filter(customer => customer.status === 'INACTIVE'), 
    [customers]
  );

  const suspendedCustomers = useMemo(() => 
    customers.filter(customer => customer.status === 'SUSPENDED'), 
    [customers]
  );

  const verifiedCustomers = useMemo(() => 
    customers.filter(customer => customer.is_verified), 
    [customers]
  );

  // Summary statistics
  const summary = useMemo(() => {
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.total_spent, 0);
    const totalOrders = customers.reduce((sum, customer) => sum + customer.total_orders, 0);
    const averageOrdersPerCustomer = totalCustomers > 0 ? totalOrders / totalCustomers : 0;
    const averageRevenuePerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    return {
      total_customers: totalCustomers,
      active_customers: activeCustomers.length,
      inactive_customers: inactiveCustomers.length,
      suspended_customers: suspendedCustomers.length,
      verified_customers: verifiedCustomers.length,
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      average_orders_per_customer: averageOrdersPerCustomer,
      average_revenue_per_customer: averageRevenuePerCustomer
    };
  }, [customers, activeCustomers, inactiveCustomers, suspendedCustomers, verifiedCustomers]);

  // Initial fetch
  useEffect(() => {
    if (token) {
      fetchCustomers();
    }
  }, [token]);

  return {
    customers,
    loading,
    error,
    pagination,
    filters,
    summary,
    activeCustomers,
    inactiveCustomers,
    suspendedCustomers,
    verifiedCustomers,
    updateFilters,
    refreshCustomers,
    updateCustomerStatus,
    fetchCustomers
  };
}

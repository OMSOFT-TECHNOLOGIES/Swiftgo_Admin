import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Checkbox } from "./ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import { Customer } from '../types/auth';
import { useCustomers } from '../hooks/useCustomers';
import { useAuth } from '../hooks/useAuth';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Package,
  Star,
  MessageCircle,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  CreditCard,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Download,
  UserX,
  UserCheck,
  Ban,
  RotateCcw,
  Send,
  FileText,
  Loader2
} from 'lucide-react';

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'in-transit' | 'pending' | 'cancelled';
  amount: number;
  items: string;
  from: string;
  to: string;
}

// Mock order history for a customer
const mockOrderHistory: Order[] = [
  {
    id: 'GS2024001234',
    date: '2024-12-15',
    status: 'delivered',
    amount: 85.50,
    items: 'Electronics Package',
    from: 'Osu, Accra',
    to: 'East Legon, Accra'
  },
  {
    id: 'GS2024001189',
    date: '2024-12-10',
    status: 'delivered',
    amount: 45.00,
    items: 'Documents',
    from: 'Tema, Accra',
    to: 'East Legon, Accra'
  },
  {
    id: 'GS2024001156',
    date: '2024-12-05',
    status: 'delivered',
    amount: 120.00,
    items: 'Fashion Items',
    from: 'Kumasi Central',
    to: 'East Legon, Accra'
  },
  {
    id: 'GS2024001098',
    date: '2024-11-28',
    status: 'cancelled',
    amount: 35.00,
    items: 'Food Package',
    from: 'Osu, Accra',
    to: 'East Legon, Accra'
  }
];

export function CustomerManagement() {
  const { isAuthenticated, token, admin, loading: authLoading } = useAuth();
  const {
    customers,
    loading,
    error,
    pagination,
    filters,
    summary,
    updateFilters,
    refreshCustomers,
    updateCustomerStatus
  } = useCustomers();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Debug: Check authentication state
  console.log('CustomerManagement - Auth state:', { isAuthenticated, hasToken: !!token, admin, authLoading });
  
  // Show message if not authenticated
  if (!isAuthenticated || !token) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground">Please log in to view customer management.</p>
            {authLoading && <p className="text-sm text-muted-foreground mt-2">Checking authentication...</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate pagination for display
  const startIndex = (pagination.current_page - 1) * pagination.limit;
  const endIndex = Math.min(startIndex + pagination.limit, pagination.total_users);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'INACTIVE': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      case 'SUSPENDED': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'in-transit': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerDialogOpen(true);
  };

  const openEditCustomer = (customer: Customer) => {
    setEditingCustomer({ ...customer });
    setIsEditDialogOpen(true);
  };

  const handleStatusChange = async (customerId: string, newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    setIsActionLoading(true);
    
    const success = await updateCustomerStatus(customerId, newStatus);
    
    if (success) {
      // Update selectedCustomer if it's being viewed
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
    
    setIsActionLoading(false);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    // Note: This would need to be implemented in the API service
    setIsActionLoading(true);
    
    // Simulate API call for now
    setTimeout(() => {
      setIsActionLoading(false);
      toast.success('Customer account deleted successfully');
      
      // Close dialog if the deleted customer was being viewed
      if (selectedCustomer?.id === customerId) {
        setIsCustomerDialogOpen(false);
        setSelectedCustomer(null);
      }
      
      // Refresh the list
      refreshCustomers();
    }, 1000);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedCustomers.length === 0) {
      toast.error('Please select customers first');
      return;
    }

    setIsActionLoading(true);
    
    // Simulate bulk operations
    try {
      for (const customerId of selectedCustomers) {
        switch (action) {
          case 'activate':
            await updateCustomerStatus(customerId, 'ACTIVE');
            break;
          case 'deactivate':
            await updateCustomerStatus(customerId, 'INACTIVE');
            break;
          case 'suspend':
            await updateCustomerStatus(customerId, 'SUSPENDED');
            break;
          case 'delete':
            // This would need to be implemented
            break;
        }
      }
      
      const actionMessages = {
        activate: `${selectedCustomers.length} customers activated`,
        deactivate: `${selectedCustomers.length} customers deactivated`,
        suspend: `${selectedCustomers.length} customers suspended`,
        delete: `${selectedCustomers.length} customers deleted`
      };
      
      toast.success(actionMessages[action as keyof typeof actionMessages]);
      setSelectedCustomers([]);
    } catch (error) {
      toast.error('Failed to perform bulk action');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(customer => customer.id));
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSearchChange = (value: string) => {
    updateFilters({ search: value });
  };

  const handleStatusFilterChange = (value: string) => {
    updateFilters({ status: value as any });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  const formatCustomerName = (customer: Customer) => {
    return customer.name || 'N/A';
  };

  const getCustomerInitials = (customer: Customer) => {
    const name = customer.name || 'NA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading && customers.length === 0) {
    return (
      <div className="p-6 lg:p-8 space-y-8 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-lg">Loading customers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 space-y-8 w-full max-w-7xl mx-auto">
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">Error Loading Customers</h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
            <Button 
              onClick={refreshCustomers} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Customer Management</h1>
            <p className="text-muted-foreground text-lg">Manage customer accounts, profiles, and relationships</p>
          </div>
          <div className="flex gap-3">
            {selectedCustomers.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2" disabled={isActionLoading}>
                    <Users className="h-4 w-4" />
                    Bulk Actions ({selectedCustomers.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                    <UserX className="h-4 w-4 mr-2" />
                    Deactivate Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('suspend')}>
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend Selected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('delete')}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <UserPlus className="h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-semibold">{summary.total_customers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Customers</p>
                  <p className="text-2xl font-semibold">{summary.active_customers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-semibold">₵ {summary.total_revenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Orders/Customer</p>
                  <p className="text-2xl font-semibold">{summary.average_orders_per_customer.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, or phone..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={filters.status} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[140px] h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>
            Showing {customers.length} of {pagination.total_users} customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && customers.length > 0 && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Updating customers...</span>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCustomers.length === customers.length && customers.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="mx-auto"
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => handleSelectCustomer(customer.id)}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getCustomerInitials(customer)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{formatCustomerName(customer)}</p>
                          <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {customer.email || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {customer.phone || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{customer.total_orders}</p>
                        <p className="text-sm text-muted-foreground">
                          ₵ {customer.total_orders > 0 ? (customer.total_spent / customer.total_orders).toFixed(2) : '0.00'} avg
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">₵ {customer.total_spent.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{new Date(customer.created_at).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openCustomerDetails(customer)}
                          className="h-8 w-8 p-0"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditCustomer(customer)}
                          className="h-8 w-8 p-0"
                          title="Edit Customer"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="More Actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openCustomerDetails(customer)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditCustomer(customer)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Customer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(customer.id, customer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                              disabled={isActionLoading}
                            >
                              {customer.status === 'ACTIVE' ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(customer.id, 'SUSPENDED')}
                              disabled={isActionLoading}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              View Orders
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Customer
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {formatCustomerName(customer)}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCustomer(customer.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={isActionLoading}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {endIndex} of {pagination.total_users} customers
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="px-3 py-1 text-sm">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages || loading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Modal */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-4 sm:px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 shrink-0">
                <AvatarFallback>{selectedCustomer ? getCustomerInitials(selectedCustomer) : 'NA'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-2xl truncate">
                  {selectedCustomer ? formatCustomerName(selectedCustomer) : 'Customer'}
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  Customer ID: {selectedCustomer?.id} • {selectedCustomer?.status && (
                    <Badge className={getStatusColor(selectedCustomer.status)}>
                      {selectedCustomer.status}
                    </Badge>
                  )}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selectedCustomer?.is_verified && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col flex-1 min-h-0">
            {selectedCustomer && (
              <Tabs defaultValue="overview" className="flex flex-col flex-1">
                <div className="px-4 sm:px-6 py-3 border-b border-border bg-muted/30 shrink-0">
                  <TabsList className="grid w-full grid-cols-4 max-w-full sm:max-w-md h-9">
                    <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                    <TabsTrigger value="orders" className="text-xs sm:text-sm">Orders</TabsTrigger>
                    <TabsTrigger value="communication" className="text-xs sm:text-sm">Messages</TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="flex-1 min-h-0">
                  <div className="px-4 sm:px-6 py-4 sm:py-6">
                    <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-0">
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                        {/* Personal Information */}
                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <User className="h-4 w-4" />
                              Personal Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 sm:space-y-4">
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Full Name</label>
                                <p className="text-xs sm:text-sm mt-1">{formatCustomerName(selectedCustomer)}</p>
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Email Address</label>
                                <p className="text-xs sm:text-sm mt-1 break-all">{selectedCustomer.email || 'N/A'}</p>
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Phone Number</label>
                                <p className="text-xs sm:text-sm mt-1">{selectedCustomer.phone || 'N/A'}</p>
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Address</label>
                                <p className="text-xs sm:text-sm mt-1">{selectedCustomer.address || 'N/A'}</p>
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Auth Provider</label>
                                <p className="text-xs sm:text-sm mt-1">{selectedCustomer.auth_provider}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Order Statistics */}
                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Package className="h-4 w-4" />
                              Order Statistics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-3 sm:gap-6">
                              <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-blue-600">{selectedCustomer.total_orders}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Total Orders</div>
                              </div>
                              <div className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                <div className="text-lg sm:text-xl font-bold text-green-600 break-words">
                                  <span className="block">₵ {selectedCustomer.total_spent.toLocaleString()}</span>
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Total Spent</div>
                              </div>
                            </div>
                            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">Average Order Value</span>
                                <span className="text-xs sm:text-sm font-medium">
                                  ₵ {selectedCustomer.total_orders > 0 ? (selectedCustomer.total_spent / selectedCustomer.total_orders).toFixed(2) : '0.00'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">Account Status</span>
                                <Badge className={getStatusColor(selectedCustomer.status)}>
                                  {selectedCustomer.status}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">Verification Status</span>
                                <span className="text-xs sm:text-sm font-medium">
                                  {selectedCustomer.is_verified ? 'Verified' : 'Not Verified'}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Account Information */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Account Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 sm:space-y-3">
                          <div className="flex justify-between">
                            <span className="text-xs sm:text-sm text-muted-foreground">Member Since</span>
                            <span className="text-xs sm:text-sm font-medium">
                              {new Date(selectedCustomer.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs sm:text-sm text-muted-foreground">Last Updated</span>
                            <span className="text-xs sm:text-sm font-medium">
                              {new Date(selectedCustomer.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs sm:text-sm text-muted-foreground">Average Rating Given</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                              <span className="text-xs sm:text-sm font-medium">
                                {selectedCustomer.average_rating_given?.toFixed(1) || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-3 sm:space-y-4 mt-0 flex flex-col h-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                        <h3 className="text-base sm:text-lg font-semibold">Order History</h3>
                        <Button variant="outline" size="sm" className="self-start sm:self-auto">
                          <Download className="h-4 w-4 mr-2" />
                          Export Orders
                        </Button>
                      </div>
                      
                      <Card className="border-0 shadow-sm flex-1 min-h-0">
                        <CardContent className="p-0 h-full">
                          <div className="h-[350px] border rounded-lg overflow-hidden">
                            <ScrollArea className="h-full w-full">
                              <div className="w-full overflow-x-auto">
                                <div className="min-w-[800px]">
                                  <Table>
                                    <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 z-10 border-b">
                                      <TableRow>
                                        <TableHead className="min-w-[120px] p-3 whitespace-nowrap">Order ID</TableHead>
                                        <TableHead className="min-w-[100px] p-3 whitespace-nowrap">Date</TableHead>
                                        <TableHead className="min-w-[120px] p-3 whitespace-nowrap">Items</TableHead>
                                        <TableHead className="min-w-[200px] p-3 whitespace-nowrap">Route</TableHead>
                                        <TableHead className="min-w-[100px] p-3 whitespace-nowrap">Amount</TableHead>
                                        <TableHead className="min-w-[100px] p-3 whitespace-nowrap">Status</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {mockOrderHistory.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-muted/50">
                                          <TableCell className="font-mono text-xs sm:text-sm p-3 whitespace-nowrap">{order.id}</TableCell>
                                          <TableCell className="text-xs sm:text-sm p-3 whitespace-nowrap">{new Date(order.date).toLocaleDateString()}</TableCell>
                                          <TableCell className="text-xs sm:text-sm p-3 whitespace-nowrap">{order.items}</TableCell>
                                          <TableCell className="p-3">
                                            <div className="space-y-1 min-w-[180px]">
                                              <div className="text-xs sm:text-sm">From: {order.from}</div>
                                              <div className="text-xs sm:text-sm text-muted-foreground">To: {order.to}</div>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm p-3 whitespace-nowrap">₵ {order.amount.toFixed(2)}</TableCell>
                                          <TableCell className="p-3 whitespace-nowrap">
                                            <Badge className={getOrderStatusColor(order.status)}>
                                              {order.status}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </ScrollArea>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="communication" className="space-y-4 mt-0">
                      <Card className="border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle>Send Message</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Message Type</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select message type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="push">Push Notification</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <textarea
                              className="w-full min-h-[100px] p-3 border rounded-lg text-sm"
                              placeholder="Type your message here..."
                            />
                          </div>
                          <Button className="w-full">
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4 mt-0">
                      <Card className="border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle>Account Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">Account Status</h4>
                              <p className="text-sm text-muted-foreground">Change customer account status</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={selectedCustomer.status === 'ACTIVE' ? 'default' : 'outline'}
                                onClick={() => handleStatusChange(selectedCustomer.id, 'ACTIVE')}
                                disabled={isActionLoading}
                              >
                                Activate
                              </Button>
                              <Button
                                size="sm"
                                variant={selectedCustomer.status === 'SUSPENDED' ? 'destructive' : 'outline'}
                                onClick={() => handleStatusChange(selectedCustomer.id, 'SUSPENDED')}
                                disabled={isActionLoading}
                              >
                                Suspend
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">Reset Password</h4>
                              <p className="text-sm text-muted-foreground">Send password reset link to customer</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Reset Password
                            </Button>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">Export Data</h4>
                              <p className="text-sm text-muted-foreground">Download customer data and order history</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Export Data
                            </Button>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                            <div>
                              <h4 className="font-medium text-destructive">Delete Account</h4>
                              <p className="text-sm text-muted-foreground">Permanently delete this customer account</p>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Customer Account</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to permanently delete {formatCustomerName(selectedCustomer)}&#39;s account? 
                                    This action cannot be undone and all associated data will be lost.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={isActionLoading}
                                  >
                                    Delete Account
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </ScrollArea>
              </Tabs>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-muted/30 shrink-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsCustomerDialogOpen(false)}>
                Close
              </Button>
              <Button size="sm" onClick={() => openEditCustomer(selectedCustomer!)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

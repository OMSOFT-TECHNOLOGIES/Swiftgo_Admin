import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Checkbox } from "./ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
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
  Activity,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Download,
  Upload,
  UserX,
  UserCheck,
  Shield,
  Ban,
  RotateCcw,
  Send,
  Copy,
  FileText,
  History
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  joinDate: string;
  lastOrderDate: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  status: 'active' | 'inactive' | 'suspended';
  preferredPayment: string;
  rating: number;
  avatar?: string;
  tags: string[];
  notes?: string;
}

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'in-transit' | 'pending' | 'cancelled';
  amount: number;
  items: string;
  from: string;
  to: string;
}

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: 'CUST001',
    name: 'Kwame Asante',
    email: 'kwame.asante@email.com',
    phone: '+233 24 123 4567',
    address: '15 Liberation Road',
    city: 'Accra',
    region: 'Greater Accra',
    joinDate: '2024-01-15',
    lastOrderDate: '2024-12-15',
    totalOrders: 47,
    totalSpent: 2340.50,
    averageOrderValue: 49.80,
    status: 'active',
    preferredPayment: 'Mobile Money',
    rating: 4.8,
    tags: ['VIP', 'Frequent'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    notes: 'Preferred delivery time: 9 AM - 12 PM'
  },
  {
    id: 'CUST002',
    name: 'Ama Osei',
    email: 'ama.osei@gmail.com',
    phone: '+233 20 987 6543',
    address: 'East Legon, Boundary Road',
    city: 'Accra',
    region: 'Greater Accra',
    joinDate: '2024-03-22',
    lastOrderDate: '2024-12-14',
    totalOrders: 23,
    totalSpent: 1150.25,
    averageOrderValue: 50.01,
    status: 'active',
    preferredPayment: 'Card Payment',
    rating: 4.6,
    tags: ['Regular'],
    notes: 'Lives in gated community - call upon arrival'
  },
  {
    id: 'CUST003',
    name: 'Kofi Addo',
    email: 'kofi.addo@yahoo.com',
    phone: '+233 26 456 7890',
    address: 'Adum, Commercial Street',
    city: 'Kumasi',
    region: 'Ashanti',
    joinDate: '2024-02-10',
    lastOrderDate: '2024-12-10',
    totalOrders: 31,
    totalSpent: 1875.75,
    averageOrderValue: 60.51,
    status: 'active',
    preferredPayment: 'Cash on Delivery',
    rating: 4.9,
    tags: ['Business', 'Bulk Orders'],
    notes: 'Business customer - office deliveries preferred'
  },
  {
    id: 'CUST004',
    name: 'Akosua Frimpong',
    email: 'akosua.frimpong@hotmail.com',
    phone: '+233 55 234 5678',
    address: 'Spintex Road, Community 18',
    city: 'Accra',
    region: 'Greater Accra',
    joinDate: '2024-06-05',
    lastOrderDate: '2024-11-28',
    totalOrders: 12,
    totalSpent: 480.00,
    averageOrderValue: 40.00,
    status: 'inactive',
    preferredPayment: 'Mobile Money',
    rating: 4.2,
    tags: ['New'],
    notes: 'Student - flexible delivery times'
  },
  {
    id: 'CUST005',
    name: 'Yaw Mensah',
    email: 'yaw.mensah@outlook.com',
    phone: '+233 27 345 6789',
    address: 'Tamale Central, Market Road',
    city: 'Tamale',
    region: 'Northern',
    joinDate: '2024-04-18',
    lastOrderDate: '2024-12-12',
    totalOrders: 18,
    totalSpent: 920.30,
    averageOrderValue: 51.13,
    status: 'active',
    preferredPayment: 'Bank Transfer',
    rating: 4.7,
    tags: ['Regional'],
    notes: 'Remote area - coordinate with local hub'
  },
  {
    id: 'CUST006',
    name: 'Abena Nyong',
    email: 'abena.nyong@gmail.com',
    phone: '+233 24 765 4321',
    address: 'Tema Community 4',
    city: 'Tema',
    region: 'Greater Accra',
    joinDate: '2024-05-30',
    lastOrderDate: '2024-07-15',
    totalOrders: 8,
    totalSpent: 320.00,
    averageOrderValue: 40.00,
    status: 'suspended',
    preferredPayment: 'Mobile Money',
    rating: 3.8,
    tags: ['Issues'],
    notes: 'Payment issues - suspended pending resolution'
  }
];

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
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesRegion = regionFilter === 'all' || customer.region === regionFilter;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
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

  const handleStatusChange = async (customerId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, status: newStatus }
          : customer
      ));
      
      // Update selectedCustomer if it's being viewed
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(prev => prev ? { ...prev, status: newStatus } : null);
      }
      
      setIsLoading(false);
      
      // Show success toast
      const statusMessages = {
        active: 'Customer account activated successfully',
        inactive: 'Customer account deactivated',
        suspended: 'Customer account suspended'
      };
      
      toast.success(statusMessages[newStatus]);
    }, 1000);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      setIsLoading(false);
      toast.success('Customer account deleted successfully');
      
      // Close dialog if the deleted customer was being viewed
      if (selectedCustomer?.id === customerId) {
        setIsCustomerDialogOpen(false);
        setSelectedCustomer(null);
      }
    }, 1000);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedCustomers.length === 0) {
      toast.error('Please select customers first');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      switch (action) {
        case 'activate':
          setCustomers(prev => prev.map(customer => 
            selectedCustomers.includes(customer.id) 
              ? { ...customer, status: 'active' }
              : customer
          ));
          toast.success(`${selectedCustomers.length} customers activated`);
          break;
        case 'deactivate':
          setCustomers(prev => prev.map(customer => 
            selectedCustomers.includes(customer.id) 
              ? { ...customer, status: 'inactive' }
              : customer
          ));
          toast.success(`${selectedCustomers.length} customers deactivated`);
          break;
        case 'suspend':
          setCustomers(prev => prev.map(customer => 
            selectedCustomers.includes(customer.id) 
              ? { ...customer, status: 'suspended' }
              : customer
          ));
          toast.success(`${selectedCustomers.length} customers suspended`);
          break;
        case 'delete':
          setCustomers(prev => prev.filter(customer => !selectedCustomers.includes(customer.id)));
          toast.success(`${selectedCustomers.length} customers deleted`);
          break;
      }
      
      setSelectedCustomers([]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === currentCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(currentCustomers.map(customer => customer.id));
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSaveEdit = () => {
    if (!editingCustomer) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setCustomers(prev => prev.map(customer => 
        customer.id === editingCustomer.id ? editingCustomer : customer
      ));
      
      // Update selectedCustomer if it's being viewed
      if (selectedCustomer?.id === editingCustomer.id) {
        setSelectedCustomer(editingCustomer);
      }
      
      setIsEditDialogOpen(false);
      setEditingCustomer(null);
      setIsLoading(false);
      toast.success('Customer information updated successfully');
    }, 1000);
  };

  // Calculate summary statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrdersPerCustomer = customers.reduce((sum, c) => sum + c.totalOrders, 0) / totalCustomers;

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
                  <Button variant="outline" className="gap-2">
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
                  <p className="text-2xl font-semibold">{totalCustomers.toLocaleString()}</p>
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
                  <p className="text-2xl font-semibold">{activeCustomers}</p>
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
                  <p className="text-2xl font-semibold">₵ {totalRevenue.toLocaleString()}</p>
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
                  <p className="text-2xl font-semibold">{averageOrdersPerCustomer.toFixed(1)}</p>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[160px] h-10">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Greater Accra">Greater Accra</SelectItem>
                  <SelectItem value="Ashanti">Ashanti</SelectItem>
                  <SelectItem value="Northern">Northern</SelectItem>
                  <SelectItem value="Western">Western</SelectItem>
                  <SelectItem value="Eastern">Eastern</SelectItem>
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
            Showing {currentCustomers.length} of {filteredCustomers.length} customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCustomers.length === currentCustomers.length && currentCustomers.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="mx-auto"
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCustomers.map((customer) => (
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
                          <AvatarImage src={customer.avatar} />
                          <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{customer.city}</p>
                        <p className="text-sm text-muted-foreground">{customer.region}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{customer.totalOrders}</p>
                        <p className="text-sm text-muted-foreground">₵ {customer.averageOrderValue.toFixed(2)} avg</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">₵ {customer.totalSpent.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
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
                              onClick={() => handleStatusChange(customer.id, customer.status === 'active' ? 'inactive' : 'active')}
                            >
                              {customer.status === 'active' ? (
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
                              onClick={() => handleStatusChange(customer.id, 'suspended')}
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
                                    Are you sure you want to delete {customer.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCustomer(customer.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} customers
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
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
                <AvatarImage src={selectedCustomer?.avatar} />
                <AvatarFallback>{selectedCustomer?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-2xl truncate">{selectedCustomer?.name}</DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  Customer ID: {selectedCustomer?.id} • {selectedCustomer?.status && (
                    <Badge className={getStatusColor(selectedCustomer.status)}>
                      {selectedCustomer.status}
                    </Badge>
                  )}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-sm sm:text-base">{selectedCustomer?.rating}</span>
                </div>
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
                                <p className="text-xs sm:text-sm mt-1">{selectedCustomer.name}</p>
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Email Address</label>
                                <p className="text-xs sm:text-sm mt-1 break-all">{selectedCustomer.email}</p>
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Phone Number</label>
                                <p className="text-xs sm:text-sm mt-1">{selectedCustomer.phone}</p>
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Address</label>
                                <p className="text-xs sm:text-sm mt-1">{selectedCustomer.address}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">City</label>
                                  <p className="text-xs sm:text-sm mt-1">{selectedCustomer.city}</p>
                                </div>
                                <div>
                                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Region</label>
                                  <p className="text-xs sm:text-sm mt-1">{selectedCustomer.region}</p>
                                </div>
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
                                <div className="text-xl sm:text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Total Orders</div>
                              </div>
                              <div className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                <div className="text-lg sm:text-xl font-bold text-green-600 break-words">
                                  <span className="block">₵ {selectedCustomer.totalSpent.toLocaleString()}</span>
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Total Spent</div>
                              </div>
                            </div>
                            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">Average Order Value</span>
                                <span className="text-xs sm:text-sm font-medium">₵ {selectedCustomer.averageOrderValue.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">Preferred Payment</span>
                                <span className="text-xs sm:text-sm font-medium">{selectedCustomer.preferredPayment}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-muted-foreground">Last Order Date</span>
                                <span className="text-xs sm:text-sm font-medium">{new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Customer Tags and Notes */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Tags & Notes</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 sm:space-y-4">
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-muted-foreground">Customer Tags</label>
                              <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                                {selectedCustomer.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {selectedCustomer.notes && (
                              <div>
                                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Notes</label>
                                <p className="text-xs sm:text-sm mt-1 p-2 sm:p-3 bg-muted rounded-lg">{selectedCustomer.notes}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Account Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 sm:space-y-3">
                            <div className="flex justify-between">
                              <span className="text-xs sm:text-sm text-muted-foreground">Member Since</span>
                              <span className="text-xs sm:text-sm font-medium">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs sm:text-sm text-muted-foreground">Customer Rating</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                                <span className="text-xs sm:text-sm font-medium">{selectedCustomer.rating}</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs sm:text-sm text-muted-foreground">Account Status</span>
                              <Badge className={getStatusColor(selectedCustomer.status)}>
                                {selectedCustomer.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
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
                                      {/* Add more demo rows to demonstrate scrolling */}
                                      {[...Array(15)].map((_, index) => (
                                        <TableRow key={`demo-${index}`} className="hover:bg-muted/50">
                                          <TableCell className="font-mono text-xs sm:text-sm p-3 whitespace-nowrap">GS202400{(index + 10).toString().padStart(2, '0')}</TableCell>
                                          <TableCell className="text-xs sm:text-sm p-3 whitespace-nowrap">{new Date(Date.now() - (index + 1) * 86400000).toLocaleDateString()}</TableCell>
                                          <TableCell className="text-xs sm:text-sm p-3 whitespace-nowrap">Package Item {index + 1}</TableCell>
                                          <TableCell className="p-3">
                                            <div className="space-y-1 min-w-[180px]">
                                              <div className="text-xs sm:text-sm">From: {['Accra Central', 'Kumasi Station', 'Tema Harbor', 'Takoradi Port'][index % 4]}</div>
                                              <div className="text-xs sm:text-sm text-muted-foreground">To: {['East Legon', 'Ashanti New Town', 'Community ' + (index + 1), 'Airport Area'][index % 4]}</div>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm p-3 whitespace-nowrap">₵ {(35 + index * 8).toFixed(2)}</TableCell>
                                          <TableCell className="p-3 whitespace-nowrap">
                                            <Badge className={getOrderStatusColor(['delivered', 'in-transit', 'pending', 'delivered'][index % 4])}>
                                              {['delivered', 'in-transit', 'pending', 'delivered'][index % 4]}
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
                          <CardTitle>Communication History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <MessageCircle className="h-4 w-4" />
                                  <span className="font-medium">SMS Notification</span>
                                </div>
                                <span className="text-sm text-muted-foreground">2 days ago</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Order #GS2024001234 has been delivered successfully to your location.
                              </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <span className="font-medium">Email</span>
                                </div>
                                <span className="text-sm text-muted-foreground">1 week ago</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Welcome to GlobeSwiftGo! Your account has been activated successfully.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

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
                                variant={selectedCustomer.status === 'active' ? 'default' : 'outline'}
                                onClick={() => handleStatusChange(selectedCustomer.id, 'active')}
                              >
                                Activate
                              </Button>
                              <Button
                                size="sm"
                                variant={selectedCustomer.status === 'suspended' ? 'destructive' : 'outline'}
                                onClick={() => handleStatusChange(selectedCustomer.id, 'suspended')}
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
                                    Are you sure you want to permanently delete {selectedCustomer.name}&#39;s account? 
                                    This action cannot be undone and all associated data will be lost.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Edit Customer - {editingCustomer.name}</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Update customer information and preferences
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Full Name</label>
                    <Input
                      value={editingCustomer.name}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={editingCustomer.email}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Phone</label>
                    <Input
                      value={editingCustomer.phone}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Status</label>
                    <Select
                      value={editingCustomer.status}
                      onValueChange={(value: 'active' | 'inactive' | 'suspended') =>
                        setEditingCustomer({ ...editingCustomer, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Address</label>
                  <Input
                    value={editingCustomer.address}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">City</label>
                    <Input
                      value={editingCustomer.city}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Region</label>
                    <Select
                      value={editingCustomer.region}
                      onValueChange={(value) => setEditingCustomer({ ...editingCustomer, region: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Greater Accra">Greater Accra</SelectItem>
                        <SelectItem value="Ashanti">Ashanti</SelectItem>
                        <SelectItem value="Northern">Northern</SelectItem>
                        <SelectItem value="Western">Western</SelectItem>
                        <SelectItem value="Eastern">Eastern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Notes</label>
                  <textarea
                    className="w-full min-h-[80px] sm:min-h-[100px] p-2 sm:p-3 border rounded-lg text-xs sm:text-sm resize-none"
                    value={editingCustomer.notes || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                    placeholder="Add customer notes..."
                  />
                </div>
              </div>
            </ScrollArea>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";
import { 
  Search, 
  Eye, 
  MapPin, 
  Clock, 
  Package, 
  Filter, 
  Navigation, 
  Phone, 
  User, 
  CheckCircle, 
  Truck, 
  ArrowRight, 
  RefreshCw, 
  Route, 
  AlertCircle,
  Info,
  Star,
  Share,
  MessageCircle,
  FileText,
  Download,
  Calendar,
  Target,
  Activity,
  Zap,
  Globe
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface OrderDetails {
  id: string;
  customer: string;
  customerPhone: string;
  pickup: string;
  pickupCoords: { lat: number; lng: number };
  delivery: string;
  deliveryCoords: { lat: number; lng: number };
  rider: string | null;
  riderPhone?: string;
  status: 'pending' | 'confirmed' | 'pickup' | 'in-transit' | 'delivered' | 'cancelled';
  amount: string;
  time: string;
  estimatedTime: string;
  rating: number | null;
  distance: string;
  priority: 'low' | 'normal' | 'high';
  paymentMethod: string;
  notes?: string;
  timeline: {
    status: string;
    time: string;
    location?: string;
    description: string;
  }[];
  currentLocation?: { lat: number; lng: number };
  progress: number;
}

const orders: OrderDetails[] = [
  {
    id: 'GS-2024-001',
    customer: 'Akosua Osei',
    customerPhone: '+233 24 123 4567',
    pickup: 'Accra Mall, East Legon',
    pickupCoords: { lat: 5.6508, lng: -0.1677 },
    delivery: 'University of Ghana, Legon',
    deliveryCoords: { lat: 5.6518, lng: -0.1857 },
    rider: 'Kwame Asante',
    riderPhone: '+233 20 987 6543',
    status: 'delivered',
    amount: '₵65.50',
    time: '2024-09-02 14:30',
    estimatedTime: '25 mins',
    distance: '8.5 km',
    priority: 'normal',
    paymentMethod: 'Mobile Money',
    notes: 'Please call on arrival',
    rating: 5,
    progress: 100,
    timeline: [
      { status: 'Order Placed', time: '14:30', description: 'Order received and confirmed' },
      { status: 'Rider Assigned', time: '14:32', description: 'Kwame Asante assigned to delivery' },
      { status: 'Pickup Confirmed', time: '14:45', location: 'Accra Mall', description: 'Package collected from pickup location' },
      { status: 'In Transit', time: '14:50', description: 'On the way to delivery location' },
      { status: 'Delivered', time: '15:15', location: 'University of Ghana', description: 'Package successfully delivered' }
    ],
    currentLocation: { lat: 5.6518, lng: -0.1857 }
  },
  {
    id: 'GS-2024-002',
    customer: 'Kofi Adjei',
    customerPhone: '+233 26 234 5678',
    pickup: 'Kejetia Market, Kumasi',
    pickupCoords: { lat: 6.6885, lng: -1.6244 },
    delivery: 'KNUST Campus, Kumasi',
    deliveryCoords: { lat: 6.6745, lng: -1.5716 },
    rider: 'Ama Serwaa',
    riderPhone: '+233 24 876 5432',
    status: 'in-transit',
    amount: '₵48.20',
    time: '2024-09-02 15:15',
    estimatedTime: '12 mins',
    distance: '6.2 km',
    priority: 'high',
    paymentMethod: 'Cash on Delivery',
    rating: null,
    progress: 75,
    timeline: [
      { status: 'Order Placed', time: '15:15', description: 'Order received and confirmed' },
      { status: 'Rider Assigned', time: '15:17', description: 'Ama Serwaa assigned to delivery' },
      { status: 'Pickup Confirmed', time: '15:30', location: 'Kejetia Market', description: 'Package collected from pickup location' },
      { status: 'In Transit', time: '15:35', description: 'On the way to delivery location' }
    ],
    currentLocation: { lat: 6.6800, lng: -1.6000 }
  },
  {
    id: 'GS-2024-003',
    customer: 'Efua Mensah',
    customerPhone: '+233 27 345 6789',
    pickup: 'Tema Station, Accra',
    pickupCoords: { lat: 5.6692, lng: -0.0166 },
    delivery: 'Airport Residential, Accra',
    deliveryCoords: { lat: 5.6037, lng: -0.1669 },
    rider: 'Yaw Boateng',
    riderPhone: '+233 23 765 4321',
    status: 'pickup',
    amount: '₵82.00',
    time: '2024-09-02 15:45',
    estimatedTime: '35 mins',
    distance: '12.8 km',
    priority: 'normal',
    paymentMethod: 'Card Payment',
    notes: 'Fragile items - handle with care',
    rating: null,
    progress: 25,
    timeline: [
      { status: 'Order Placed', time: '15:45', description: 'Order received and confirmed' },
      { status: 'Rider Assigned', time: '15:47', description: 'Yaw Boateng assigned to delivery' },
      { status: 'En Route to Pickup', time: '15:50', description: 'Rider heading to pickup location' }
    ],
    currentLocation: { lat: 5.6650, lng: -0.0200 }
  },
  {
    id: 'GS-2024-004',
    customer: 'Nana Adomako',
    customerPhone: '+233 25 456 7890',
    pickup: 'Kantamanto Market, Accra',
    pickupCoords: { lat: 5.5502, lng: -0.2174 },
    delivery: 'Dansoman, Accra',
    deliveryCoords: { lat: 5.5356, lng: -0.2928 },
    rider: null,
    status: 'confirmed',
    amount: '₵39.25',
    time: '2024-09-02 16:00',
    estimatedTime: '30 mins',
    distance: '7.1 km',
    priority: 'low',
    paymentMethod: 'Mobile Money',
    rating: null,
    progress: 10,
    timeline: [
      { status: 'Order Placed', time: '16:00', description: 'Order received and confirmed' },
      { status: 'Finding Rider', time: '16:02', description: 'Searching for available rider' }
    ]
  },
  {
    id: 'GS-2024-005',
    customer: 'Abena Nyong',
    customerPhone: '+233 28 567 8901',
    pickup: 'Circle Odawna, Accra',
    pickupCoords: { lat: 5.5679, lng: -0.2297 },
    delivery: '37 Military Hospital, Accra',
    deliveryCoords: { lat: 5.5848, lng: -0.1985 },
    rider: 'Kojo Mensah',
    riderPhone: '+233 22 654 3210',
    status: 'cancelled',
    amount: '₵58.60',
    time: '2024-09-02 13:20',
    estimatedTime: '-',
    distance: '4.3 km',
    priority: 'normal',
    paymentMethod: 'Mobile Money',
    notes: 'Customer requested cancellation',
    rating: null,
    progress: 0,
    timeline: [
      { status: 'Order Placed', time: '13:20', description: 'Order received and confirmed' },
      { status: 'Rider Assigned', time: '13:22', description: 'Kojo Mensah assigned to delivery' },
      { status: 'Cancelled', time: '13:25', description: 'Order cancelled by customer' }
    ]
  },
  {
    id: 'GS-2024-006',
    customer: 'Kwaku Mensah',
    customerPhone: '+233 29 678 9012',
    pickup: 'Madina Market, Accra',
    pickupCoords: { lat: 5.6893, lng: -0.1558 },
    delivery: 'Spintex Road, Accra',
    deliveryCoords: { lat: 5.6342, lng: -0.0833 },
    rider: 'Adjoa Amponsah',
    riderPhone: '+233 21 543 2109',
    status: 'in-transit',
    amount: '₵42.75',
    time: '2024-09-02 16:30',
    estimatedTime: '18 mins',
    distance: '9.7 km',
    priority: 'high',
    paymentMethod: 'Card Payment',
    rating: null,
    progress: 60,
    timeline: [
      { status: 'Order Placed', time: '16:30', description: 'Order received and confirmed' },
      { status: 'Rider Assigned', time: '16:32', description: 'Adjoa Amponsah assigned to delivery' },
      { status: 'Pickup Confirmed', time: '16:45', location: 'Madina Market', description: 'Package collected from pickup location' },
      { status: 'In Transit', time: '16:50', description: 'On the way to delivery location' }
    ],
    currentLocation: { lat: 5.6600, lng: -0.1200 }
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'delivered':
      return <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">Delivered</Badge>;
    case 'in-transit':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">In Transit</Badge>;
    case 'pickup':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200 font-medium">At Pickup</Badge>;
    case 'confirmed':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-medium">Confirmed</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-medium">Pending</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">Cancelled</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive" className="text-xs">High</Badge>;
    case 'normal':
      return <Badge variant="secondary" className="text-xs">Normal</Badge>;
    case 'low':
      return <Badge variant="outline" className="text-xs">Low</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">Normal</Badge>;
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 75) return 'bg-blue-500';
  if (progress >= 50) return 'bg-yellow-500';
  if (progress >= 25) return 'bg-orange-500';
  return 'bg-gray-300';
};

export function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<OrderDetails | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate order updates for in-transit orders
      if (trackedOrder && trackedOrder.status === 'in-transit') {
        setTrackedOrder(prev => {
          if (prev && prev.progress < 100) {
            return {
              ...prev,
              progress: Math.min(prev.progress + Math.random() * 5, 95)
            };
          }
          return prev;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [trackedOrder]);

  const handleTrackOrder = (orderId?: string) => {
    const orderToTrack = orderId ? orders.find(o => o.id === orderId) : orders.find(o => o.id === trackingOrderId);
    
    if (orderToTrack) {
      setTrackedOrder(orderToTrack);
      setIsTrackingOpen(true);
      toast.success(`Tracking ${orderToTrack.id}`);
    } else {
      toast.error('Order not found. Please check the order ID.');
    }
  };

  const handleRefreshTracking = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      if (trackedOrder) {
        const updatedOrder = orders.find(o => o.id === trackedOrder.id);
        if (updatedOrder) {
          setTrackedOrder(updatedOrder);
          toast.success('Tracking information updated');
        }
      }
    }, 1000);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.delivery.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.rider && order.rider.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const activeOrders = orders.filter(o => ['confirmed', 'pickup', 'in-transit'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-none">
      {/* Header with Stats */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Orders Management</h1>
            <p className="text-muted-foreground text-lg">Manage and track all delivery orders</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Export Orders
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Package className="h-4 w-4" />
              New Order
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-semibold">{orders.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-semibold">{activeOrders.length}</p>
                </div>
                <Truck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-semibold">{completedOrders.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Delivery</p>
                  <p className="text-2xl font-semibold">28 min</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Track Order */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-indigo-600" />
                  Quick Track Order
                </h3>
                <p className="text-sm text-muted-foreground">Enter order ID to track delivery status in real-time</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter Order ID (e.g., GS-2024-001)"
                    value={trackingOrderId}
                    onChange={(e) => setTrackingOrderId(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={() => handleTrackOrder()}
                  disabled={!trackingOrderId.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Track
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Enhanced Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders, customers, locations, or riders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pickup">At Pickup</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Orders Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Orders ({filteredOrders.length})</CardTitle>
              <CardDescription className="text-base">Recent delivery orders and their tracking status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Rider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium font-mono text-sm">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-green-600" />
                            <span className="truncate max-w-[120px]">{order.pickup}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[120px]">{order.delivery}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{order.distance}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.rider ? (
                          <div>
                            <p className="font-medium text-sm">{order.rider}</p>
                            <p className="text-xs text-muted-foreground">{order.riderPhone}</p>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs">Unassigned</Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Progress value={order.progress} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground w-8">{order.progress}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">ETA: {order.estimatedTime}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.amount}</p>
                          <p className="text-xs text-muted-foreground">{order.paymentMethod}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTrackOrder(order.id)}
                            className="h-8 w-8 p-0"
                            title="Track Order"
                          >
                            <Navigation className="h-3 w-3" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="h-8 w-8 p-0"
                                title="View Details"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Package className="h-5 w-5" />
                                  Order Details - {order.id}
                                </DialogTitle>
                                <DialogDescription>
                                  Complete information and timeline for this delivery order
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Order Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <label className="font-medium text-sm">Customer Information</label>
                                    <div className="space-y-1">
                                      <p className="font-medium">{order.customer}</p>
                                      <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="font-medium text-sm">Order Status</label>
                                    <div className="flex items-center gap-2">
                                      {getStatusBadge(order.status)}
                                      {getPriorityBadge(order.priority)}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="font-medium text-sm">Payment</label>
                                    <div>
                                      <p className="font-medium">{order.amount}</p>
                                      <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                {/* Route Information */}
                                <div className="space-y-4">
                                  <h4 className="font-medium flex items-center gap-2">
                                    <Route className="h-4 w-4" />
                                    Route Information
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="font-medium text-sm text-green-600">Pickup Location</label>
                                      <p className="text-sm">{order.pickup}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="font-medium text-sm text-blue-600">Delivery Location</label>
                                      <p className="text-sm">{order.delivery}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <label className="font-medium text-sm">Distance</label>
                                      <p className="text-sm text-muted-foreground">{order.distance}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium text-sm">Estimated Time</label>
                                      <p className="text-sm text-muted-foreground">{order.estimatedTime}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium text-sm">Progress</label>
                                      <div className="flex items-center gap-2">
                                        <Progress value={order.progress} className="h-2 flex-1" />
                                        <span className="text-xs">{order.progress}%</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Rider Information */}
                                {order.rider && (
                                  <>
                                    <Separator />
                                    <div className="space-y-4">
                                      <h4 className="font-medium flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Rider Information
                                      </h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="font-medium text-sm">Rider Name</label>
                                          <p>{order.rider}</p>
                                        </div>
                                        <div>
                                          <label className="font-medium text-sm">Contact</label>
                                          <p className="text-sm text-muted-foreground">{order.riderPhone}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Notes */}
                                {order.notes && (
                                  <>
                                    <Separator />
                                    <div className="space-y-2">
                                      <label className="font-medium text-sm">Order Notes</label>
                                      <div className="bg-muted/50 p-3 rounded-lg">
                                        <p className="text-sm">{order.notes}</p>
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Rating */}
                                {order.rating && (
                                  <>
                                    <Separator />
                                    <div className="space-y-2">
                                      <label className="font-medium text-sm">Customer Rating</label>
                                      <div className="flex items-center gap-2">
                                        <div className="flex">
                                          {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < order.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                          ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">({order.rating}/5)</span>
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                  <Button 
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    onClick={() => handleTrackOrder(order.id)}
                                  >
                                    <Navigation className="h-4 w-4" />
                                    Track Order
                                  </Button>
                                  {order.status === 'confirmed' && (
                                    <Button size="sm" variant="outline">
                                      <User className="h-4 w-4 mr-2" />
                                      Assign Rider
                                    </Button>
                                  )}
                                  <Button size="sm" variant="outline">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Contact Customer
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Share className="h-4 w-4 mr-2" />
                                    Share
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Active Orders ({activeOrders.length})
              </CardTitle>
              <CardDescription>Orders currently being processed or in transit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{order.pickup} → {order.delivery}</p>
                          <div className="flex items-center gap-2">
                            <Progress value={order.progress} className="h-2 w-24" />
                            <span className="text-xs text-muted-foreground">{order.progress}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTrackOrder(order.id)}
                          >
                            <Navigation className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Completed Orders ({completedOrders.length})
              </CardTitle>
              <CardDescription>Successfully delivered orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{order.amount}</p>
                          <p className="text-sm text-muted-foreground">Delivered</p>
                        </div>
                        {order.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{order.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Cancelled Orders ({cancelledOrders.length})
              </CardTitle>
              <CardDescription>Orders that were cancelled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cancelledOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">Cancelled</p>
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Advanced Order Tracking Dialog */}
      <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {trackedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  Live Order Tracking - {trackedOrder.id}
                </DialogTitle>
                <DialogDescription>
                  Real-time tracking and delivery status information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Order Status Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{trackedOrder.customer}</h3>
                        <p className="text-sm text-muted-foreground">{trackedOrder.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleRefreshTracking}
                        disabled={refreshing}
                      >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                      {getStatusBadge(trackedOrder.status)}
                      {getPriorityBadge(trackedOrder.priority)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Delivery Progress</span>
                      <span>{trackedOrder.progress}% Complete</span>
                    </div>
                    <Progress value={trackedOrder.progress} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Order Placed</span>
                      <span>Pickup</span>
                      <span>In Transit</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Map and Route */}
                  <div className="space-y-6">
                    {/* Live Map */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-green-600" />
                          Live Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                          <div className="text-center">
                            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">Interactive map showing real-time location</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              {trackedOrder.currentLocation ? 
                                `Lat: ${trackedOrder.currentLocation.lat.toFixed(4)}, Lng: ${trackedOrder.currentLocation.lng.toFixed(4)}` : 
                                'Location data will appear here'
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Route Information */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Route className="h-5 w-5 text-purple-600" />
                          Route Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                              <MapPin className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-green-600">Pickup Location</p>
                              <p className="text-sm">{trackedOrder.pickup}</p>
                              <p className="text-xs text-muted-foreground">
                                Coordinates: {trackedOrder.pickupCoords.lat}, {trackedOrder.pickupCoords.lng}
                              </p>
                            </div>
                          </div>

                          <div className="ml-4 border-l-2 border-dashed border-muted h-8"></div>

                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                              <Target className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-blue-600">Delivery Location</p>
                              <p className="text-sm">{trackedOrder.delivery}</p>
                              <p className="text-xs text-muted-foreground">
                                Coordinates: {trackedOrder.deliveryCoords.lat}, {trackedOrder.deliveryCoords.lng}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Total Distance</p>
                            <p className="font-medium">{trackedOrder.distance}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Estimated Time</p>
                            <p className="font-medium">{trackedOrder.estimatedTime}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Timeline and Details */}
                  <div className="space-y-6">
                    {/* Order Timeline */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-orange-600" />
                          Delivery Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {trackedOrder.timeline.map((event, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                                index < trackedOrder.timeline.length - 1 || trackedOrder.status === 'delivered' 
                                  ? 'bg-green-500' 
                                  : 'bg-blue-500'
                              }`}></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">{event.status}</p>
                                  <p className="text-xs text-muted-foreground">{event.time}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                {event.location && (
                                  <p className="text-xs text-blue-600">{event.location}</p>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {/* Real-time status for active orders */}
                          {['pickup', 'in-transit'].includes(trackedOrder.status) && (
                            <div className="flex items-start gap-3 border-t pt-4 mt-4">
                              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm text-blue-600">Live Status</p>
                                  <p className="text-xs text-muted-foreground">Now</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {trackedOrder.status === 'pickup' ? 'Rider at pickup location' : 'En route to delivery'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Rider Information */}
                    {trackedOrder.rider && (
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-600" />
                            Rider Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{trackedOrder.rider}</p>
                              <p className="text-sm text-muted-foreground">{trackedOrder.riderPhone}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Order Summary */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Info className="h-5 w-5 text-gray-600" />
                          Order Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Order Amount</span>
                          <span className="font-medium">{trackedOrder.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Payment Method</span>
                          <span className="text-sm">{trackedOrder.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Order Time</span>
                          <span className="text-sm">{new Date(trackedOrder.time).toLocaleString()}</span>
                        </div>
                        {trackedOrder.notes && (
                          <>
                            <Separator />
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Special Instructions</p>
                              <div className="bg-muted/50 p-3 rounded-lg">
                                <p className="text-sm">{trackedOrder.notes}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`https://maps.google.com/?q=${trackedOrder.currentLocation?.lat || trackedOrder.deliveryCoords.lat},${trackedOrder.currentLocation?.lng || trackedOrder.deliveryCoords.lng}`, '_blank')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Open in Maps
                  </Button>
                  <Button variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Share Tracking
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Details
                  </Button>
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Customer
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
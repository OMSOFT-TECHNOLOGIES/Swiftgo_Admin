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
import { toast } from "sonner";
import { 
  Search, 
  Eye, 
  MapPin, 
  Clock, 
  Package, 
  Filter, 
  Navigation, 
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
  Phone
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useOrders } from '../hooks/useOrders';
import { Order } from '../types/auth';

export function Orders() {
  const {
    orders,
    summary,
    loading,
    error,
    activeOrders,
    completedOrders,
    cancelledOrders,
    updateFilters,
    refreshOrders
  } = useOrders();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState('');

  // Handle search and filters
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      updateFilters({
        search: searchTerm || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter, updateFilters]);

  const handleTrackOrder = (orderId?: string) => {
    const orderToTrack = orderId ? orders.find(o => o.id === orderId) : orders.find(o => o.tracking_number === trackingOrderId);
    
    if (orderToTrack) {
      setSelectedOrder(orderToTrack);
      toast.success(`Tracking ${orderToTrack.tracking_number}`);
    } else {
      toast.error('Order not found. Please check the order ID or tracking number.');
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">Delivered</Badge>;
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">In Transit</Badge>;
      case 'PICKED_UP':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200 font-medium">Picked Up</Badge>;
      case 'ACCEPTED':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-medium">Accepted</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-medium">Pending</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Order['payment_status']) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Paid</Badge>;
      case 'PENDING':
        return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'REFUNDED':
        return <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800">Refunded</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  const getParcelSizeBadge = (size: Order['parcel_size']) => {
    switch (size) {
      case 'large':
        return <Badge variant="destructive" className="text-xs">Large</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>;
      case 'small':
        return <Badge variant="outline" className="text-xs">Small</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  const getOrderProgress = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 10;
      case 'ACCEPTED': return 25;
      case 'PICKED_UP': return 50;
      case 'IN_TRANSIT': return 75;
      case 'OUT_FOR_DELIVERY': return 90;
      case 'DELIVERED': return 100;
      case 'CANCELLED': return 0;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-8 w-full max-w-none">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 space-y-8 w-full max-w-none">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={refreshOrders} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                  <p className="text-2xl font-semibold">{summary?.total_orders || orders.length}</p>
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
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-semibold">₵{summary?.total_revenue?.toFixed(2) || '0.00'}</p>
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
                <p className="text-sm text-muted-foreground">Enter tracking number to track delivery status in real-time</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter Tracking Number (e.g., SG6E7889AD)"
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
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Enhanced Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders, customers, or tracking numbers..."
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
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                      <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                      <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
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

          {/* Orders Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Orders ({orders.length})</CardTitle>
              <CardDescription className="text-base">Recent delivery orders and their tracking status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium font-mono text-sm">{order.tracking_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-green-600" />
                            <span className="truncate max-w-[120px]">{order.pickup_address}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[120px]">{order.delivery_address}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{order.distance_km} km</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Progress value={getOrderProgress(order.status)} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground w-8">{getOrderProgress(order.status)}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{getPaymentStatusBadge(order.payment_status)}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getParcelSizeBadge(order.parcel_size)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">₵{order.delivery_fee}</p>
                          <p className="text-xs text-muted-foreground">{order.payment_status}</p>
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
                                  Order Details - {order.tracking_number}
                                </DialogTitle>
                                <DialogDescription>
                                  Complete information for this delivery order
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Order Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <label className="font-medium text-sm">Customer Information</label>
                                    <div className="space-y-1">
                                      <p className="font-medium">{order.customer.name}</p>
                                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                                      {order.customer.phone && (
                                        <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="font-medium text-sm">Order Status</label>
                                    <div className="flex items-center gap-2">
                                      {getStatusBadge(order.status)}
                                      {getParcelSizeBadge(order.parcel_size)}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="font-medium text-sm">Payment</label>
                                    <div>
                                      <p className="font-medium">₵{order.delivery_fee}</p>
                                      <p className="text-sm text-muted-foreground">{order.payment_status}</p>
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
                                      <p className="text-sm">{order.pickup_address}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="font-medium text-sm text-blue-600">Delivery Location</label>
                                      <p className="text-sm">{order.delivery_address}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <label className="font-medium text-sm">Distance</label>
                                      <p className="text-sm text-muted-foreground">{order.distance_km} km</p>
                                    </div>
                                    <div>
                                      <label className="font-medium text-sm">Parcel Size</label>
                                      <p className="text-sm text-muted-foreground">{order.parcel_size}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium text-sm">Progress</label>
                                      <div className="flex items-center gap-2">
                                        <Progress value={getOrderProgress(order.status)} className="h-2 flex-1" />
                                        <span className="text-xs">{getOrderProgress(order.status)}%</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Delivery Information */}
                                <Separator />
                                <div className="space-y-4">
                                  <h4 className="font-medium flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Delivery Information
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="font-medium text-sm">Recipient Name</label>
                                      <p>{order.delivery_info.name}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium text-sm">Contact</label>
                                      <p className="text-sm text-muted-foreground">{order.delivery_info.phone}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Description */}
                                {order.description && (
                                  <>
                                    <Separator />
                                    <div className="space-y-2">
                                      <label className="font-medium text-sm">Package Description</label>
                                      <div className="bg-muted/50 p-3 rounded-lg">
                                        <p className="text-sm">{order.description}</p>
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
                                      {order.rating_comment && (
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                          <p className="text-sm">{order.rating_comment}</p>
                                        </div>
                                      )}
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
                <Truck className="h-5 w-5 text-green-600" />
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
                          <p className="font-medium">{order.tracking_number}</p>
                          <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{order.pickup_address} → {order.delivery_address}</p>
                          <div className="flex items-center gap-2">
                            <Progress value={getOrderProgress(order.status)} className="h-2 w-24" />
                            <span className="text-xs text-muted-foreground">{getOrderProgress(order.status)}%</span>
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
                          <p className="font-medium">{order.tracking_number}</p>
                          <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">₵{order.delivery_fee}</p>
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
                          <p className="font-medium">{order.tracking_number}</p>
                          <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">Cancelled</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

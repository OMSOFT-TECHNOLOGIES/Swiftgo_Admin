import { useState, useMemo } from 'react';
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { 
  Search, 
  Eye, 
  MapPin, 
  Package, 
  Truck, 
  CheckCircle, 
  DollarSign,
  RefreshCw, 
  AlertCircle,
  MoreVertical,
  Globe,
  Share,
  Download,
  MessageCircle,
  Plus
} from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../types/auth';
import { CreateOrder } from './CreateOrder';

export function Orders() {
  const {
    orders,
    summary,
    loading,
    error,
    activeOrders,
    completedOrders,
    cancelledOrders,
    refreshOrders
  } = useOrders();

  const [selectedTab, setSelectedTab] = useState("all");
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  // Filter orders based on selected tab and search
  const filteredOrders = useMemo(() => {
    let ordersToFilter: Order[] = [];
    
    switch (selectedTab) {
      case "active":
        ordersToFilter = activeOrders;
        break;
      case "completed":
        ordersToFilter = completedOrders;
        break;
      case "cancelled":
        ordersToFilter = cancelledOrders;
        break;
      default:
        ordersToFilter = orders;
    }

    if (!searchTerm) return ordersToFilter;

    return ordersToFilter.filter(order =>
      order.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.delivery_address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, activeOrders, completedOrders, cancelledOrders, selectedTab, searchTerm]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      ACCEPTED: { color: "bg-blue-100 text-blue-800", label: "Accepted" },
      PICKED_UP: { color: "bg-purple-100 text-purple-800", label: "Picked Up" },
      IN_TRANSIT: { color: "bg-orange-100 text-orange-800", label: "In Transit" },
      OUT_FOR_DELIVERY: { color: "bg-indigo-100 text-indigo-800", label: "Out for Delivery" },
      DELIVERED: { color: "bg-green-100 text-green-800", label: "Delivered" },
      CANCELLED: { color: "bg-red-100 text-red-800", label: "Cancelled" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      PAID: { color: "bg-green-100 text-green-800", label: "Paid" },
      FAILED: { color: "bg-red-100 text-red-800", label: "Failed" },
      REFUNDED: { color: "bg-gray-100 text-gray-800", label: "Refunded" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getProgressPercentage = (status: string) => {
    const progressMap = {
      PENDING: 10,
      ACCEPTED: 25,
      PICKED_UP: 50,
      IN_TRANSIT: 75,
      OUT_FOR_DELIVERY: 90,
      DELIVERED: 100,
      CANCELLED: 0
    };
    return progressMap[status as keyof typeof progressMap] || 0;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading orders</AlertTitle>
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {showCreateOrder ? (
        <CreateOrder onBack={() => setShowCreateOrder(false)} />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Orders Management</h1>
              <p className="text-muted-foreground">Track and manage all delivery orders</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setShowCreateOrder(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Order
              </Button>
              <Button onClick={refreshOrders} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {orders.filter(order => ['PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(order.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">
                  {completedOrders.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">
                  GHC {completedOrders.reduce((total, order) => total + order.delivery_fee, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders by tracking number, customer, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Order Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {searchTerm ? "Try adjusting your search terms." : "No orders available in this category."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{order.tracking_number}</h3>
                            <p className="text-sm text-muted-foreground">
                              Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {getStatusBadge(order.status)}
                            {getPaymentStatusBadge(order.payment_status)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Customer</p>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Pickup</p>
                            <p className="text-sm">{order.pickup_address}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Delivery</p>
                            <p className="text-sm">{order.delivery_address}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Progress</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={getProgressPercentage(order.status)} className="w-32" />
                              <span className="text-sm text-muted-foreground">
                                {getProgressPercentage(order.status)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground">Delivery Fee</p>
                            <p className="text-lg font-bold">GHC {order.delivery_fee}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setTrackedOrder(order);
                            setShowOrderDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                Mark as Accepted
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Mark as Picked Up
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Mark as In Transit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Mark as Delivered
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {trackedOrder?.tracking_number}</DialogTitle>
          </DialogHeader>
          
          {trackedOrder && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Order ID:</span> #{trackedOrder.id}</p>
                      <p><span className="font-medium">Tracking Number:</span> {trackedOrder.tracking_number}</p>
                      <p><span className="font-medium">Status:</span> {getStatusBadge(trackedOrder.status)}</p>
                      <p><span className="font-medium">Payment Status:</span> {getPaymentStatusBadge(trackedOrder.payment_status)}</p>
                      <p><span className="font-medium">Created:</span> {new Date(trackedOrder.created_at).toLocaleString()}</p>
                      <p><span className="font-medium">Delivery Fee:</span> GHC {trackedOrder.delivery_fee}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Customer Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {trackedOrder.customer.name}</p>
                      <p><span className="font-medium">Phone:</span> {trackedOrder.customer.phone}</p>
                      <p><span className="font-medium">Email:</span> {trackedOrder.customer.email}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Addresses</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-green-600">Pickup Address:</p>
                        <p>{trackedOrder.pickup_address}</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-600">Delivery Address:</p>
                        <p>{trackedOrder.delivery_address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rider and Progress */}
                <div className="space-y-4">
                  {trackedOrder.rider && (
                    <div>
                      <h3 className="font-semibold mb-2">Assigned Rider</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {trackedOrder.rider.name}</p>
                        <p><span className="font-medium">Phone:</span> {trackedOrder.rider.phone}</p>
                        <p><span className="font-medium">Vehicle:</span> {trackedOrder.rider.vehicle_type} - {trackedOrder.rider.vehicle_number}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-2">Order Progress</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Progress value={getProgressPercentage(trackedOrder.status)} className="flex-1" />
                        <span className="text-sm font-medium">{getProgressPercentage(trackedOrder.status)}%</span>
                      </div>
                      
                      <div className="space-y-2">
                        {['PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((status, index) => (
                          <div key={status} className={`flex items-center gap-2 text-sm ${
                            getProgressPercentage(trackedOrder.status) > index * 20 
                              ? 'text-green-600' 
                              : 'text-gray-400'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              getProgressPercentage(trackedOrder.status) > index * 20 
                                ? 'bg-green-600' 
                                : 'bg-gray-300'
                            }`} />
                            <span className="capitalize">{status.replace('_', ' ')}</span>
                            {trackedOrder.status === status && (
                              <Badge variant="outline" className="ml-2">Current</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {trackedOrder.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Order Description</h3>
                      <p className="text-sm bg-gray-50 p-3 rounded">{trackedOrder.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Order Timeline</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-medium">Order Created</p>
                      <p className="text-muted-foreground">{new Date(trackedOrder.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {trackedOrder.updated_at !== trackedOrder.created_at && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0" />
                      <div>
                        <p className="font-medium">Last Updated</p>
                        <p className="text-muted-foreground">{new Date(trackedOrder.updated_at).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Live Tracking</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Live tracking map would be integrated here</p>
                    <p className="text-xs text-gray-500 mt-1">Showing current location and route</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline">
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
        </>
      )}
    </div>
  );
}

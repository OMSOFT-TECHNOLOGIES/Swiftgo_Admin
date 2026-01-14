import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  X,
  Search, 
  Filter,
  ArrowLeft,
  Eye,
  Star,
  User,
  Phone,
  Calendar,
  MoreVertical,
  LogOut,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface MyOrdersProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

export function MyOrders({ onNavigate, onLogout, isDarkMode, toggleTheme }: MyOrdersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Sample orders data - replace with real API data
  const orders = [
    {
      id: 'GSG-001234',
      status: 'delivered',
      pickup: { address: 'East Legon Mall, Accra', name: 'John\'s Electronics', phone: '+233 24 111 1111' },
      delivery: { address: 'Osu Oxford Street, Accra', name: 'Sarah Mensah', phone: '+233 24 222 2222' },
      items: 'Samsung Galaxy Phone',
      date: '2026-01-02',
      time: '14:30',
      amount: '₵25.00',
      rider: { name: 'Emmanuel Kofi', rating: 4.8, phone: '+233 24 333 3333' },
      estimatedTime: '30 mins',
      actualTime: '28 mins'
    },
    {
      id: 'GSG-001235',
      status: 'in_transit',
      pickup: { address: 'Kumasi Central Market', name: 'Auntie Akos Shop', phone: '+233 24 444 4444' },
      delivery: { address: 'KNUST Campus, Kumasi', name: 'Michael Osei', phone: '+233 24 555 5555' },
      items: 'Traditional Kente Cloth',
      date: '2026-01-02',
      time: '16:45',
      amount: '₵18.50',
      rider: { name: 'Joseph Amoah', rating: 4.9, phone: '+233 24 666 6666' },
      estimatedTime: '45 mins',
      actualTime: null
    },
    {
      id: 'GSG-001236',
      status: 'pending',
      pickup: { address: 'Tamale Central Station', name: 'Northern Crafts Ltd', phone: '+233 24 777 7777' },
      delivery: { address: 'UDS Campus, Tamale', name: 'Fatima Abdul', phone: '+233 24 888 8888' },
      items: 'Academic Books & Materials',
      date: '2026-01-02',
      time: '18:00',
      amount: '₵30.00',
      rider: null,
      estimatedTime: '60 mins',
      actualTime: null
    },
    {
      id: 'GSG-001233',
      status: 'delivered',
      pickup: { address: 'Accra Mall, Tetteh Quarshie', name: 'Fashion Hub', phone: '+233 24 999 9999' },
      delivery: { address: 'Dansoman, Accra', name: 'Grace Adjei', phone: '+233 24 000 0000' },
      items: 'Designer Handbag',
      date: '2026-01-01',
      time: '12:15',
      amount: '₵15.00',
      rider: { name: 'Prince Manu', rating: 5.0, phone: '+233 24 111 2222' },
      estimatedTime: '25 mins',
      actualTime: '22 mins'
    },
    {
      id: 'GSG-001232',
      status: 'cancelled',
      pickup: { address: 'Tema Station', name: 'Auto Parts Ghana', phone: '+233 24 333 4444' },
      delivery: { address: 'Spintex Road, Accra', name: 'Robert Tetteh', phone: '+233 24 555 6666' },
      items: 'Car Spare Parts',
      date: '2025-12-31',
      time: '09:30',
      amount: '₵40.00',
      rider: null,
      estimatedTime: '40 mins',
      actualTime: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'in_transit': return 'In Transit';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.pickup.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.delivery.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">My Orders</h1>
                <p className="text-sm text-muted-foreground">Manage and track your delivery orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => onNavigate('new-order')}>
                <Package className="mr-2 h-4 w-4" />
                New Order
              </Button>
              
              {/* User Menu */}
              {onLogout && (
                <div className="flex items-center space-x-2">
                  {toggleTheme && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleTheme}
                      className="hover:bg-accent rounded-lg transition-colors p-2"
                    >
                      {isDarkMode ? (
                        <Sun className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Moon className="h-5 w-5 text-gray-700" />
                      )}
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-sm">U</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">Customer</p>
                          <p className="text-xs text-muted-foreground">customer@example.com</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                        <Globe className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onLogout} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID, location, or items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters.'
                    : 'You haven\'t placed any orders yet.'
                  }
                </p>
                <Button onClick={() => onNavigate('new-order')}>
                  <Package className="mr-2 h-4 w-4" />
                  Place Your First Order
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg">{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Pickup Details */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1 text-green-600" />
                            Pickup from
                          </div>
                          <div className="pl-5">
                            <p className="font-medium">{order.pickup.name}</p>
                            <p className="text-sm text-muted-foreground">{order.pickup.address}</p>
                            <p className="text-sm text-muted-foreground">{order.pickup.phone}</p>
                          </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                            Deliver to
                          </div>
                          <div className="pl-5">
                            <p className="font-medium">{order.delivery.name}</p>
                            <p className="text-sm text-muted-foreground">{order.delivery.address}</p>
                            <p className="text-sm text-muted-foreground">{order.delivery.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Items & Details */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid md:grid-cols-3 gap-4 items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Items</p>
                            <p className="font-medium">{order.items}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date & Time</p>
                            <p className="font-medium">{order.date} at {order.time}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="font-bold text-lg text-blue-600">{order.amount}</p>
                          </div>
                        </div>

                        {/* Rider Info (if assigned) */}
                        {order.rider && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium">{order.rider.name}</p>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="text-sm">{order.rider.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4 mr-1" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Timing Info */}
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Est: {order.estimatedTime}</span>
                              </div>
                              {order.actualTime && (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span>Actual: {order.actualTime}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => onNavigate(`track-order-${order.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Track
                              </Button>
                              {order.status === 'delivered' && (
                                <Button variant="outline" size="sm">
                                  <Star className="h-4 w-4 mr-1" />
                                  Rate
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination or Load More */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline">
              Load More Orders
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
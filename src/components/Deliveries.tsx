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
  ArrowLeft,
  Filter,
  Eye,
  User,
  Star,
  Phone,
  Navigation,
  Calendar,
  MoreVertical
} from 'lucide-react';

interface DeliveriesProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

export function Deliveries({ onNavigate, onLogout, isDarkMode, toggleTheme }: DeliveriesProps) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Sample deliveries data - replace with real API data
  const deliveries = [
    {
      id: 'GSG-001235',
      status: 'in_transit',
      pickup: { address: 'Kumasi Central Market', name: 'Auntie Akos Shop' },
      delivery: { address: 'KNUST Campus, Kumasi', name: 'Michael Osei' },
      items: 'Traditional Kente Cloth',
      estimatedTime: '45 mins',
      startedAt: '2026-01-02T16:45:00Z',
      estimatedArrival: '2026-01-02T17:30:00Z',
      rider: { name: 'Joseph Amoah', rating: 4.9, phone: '+233 24 666 6666' },
      amount: '₵18.50',
      progress: 65
    },
    {
      id: 'GSG-001234',
      status: 'delivered',
      pickup: { address: 'East Legon Mall, Accra', name: 'John\'s Electronics' },
      delivery: { address: 'Osu Oxford Street, Accra', name: 'Sarah Mensah' },
      items: 'Samsung Galaxy Phone',
      estimatedTime: '30 mins',
      startedAt: '2026-01-02T14:30:00Z',
      deliveredAt: '2026-01-02T14:58:00Z',
      rider: { name: 'Emmanuel Kofi', rating: 4.8, phone: '+233 24 333 3333' },
      amount: '₵25.00',
      progress: 100,
      rating: 5
    },
    {
      id: 'GSG-001236',
      status: 'picked_up',
      pickup: { address: 'Tamale Central Station', name: 'Northern Crafts Ltd' },
      delivery: { address: 'UDS Campus, Tamale', name: 'Fatima Abdul' },
      items: 'Academic Books & Materials',
      estimatedTime: '60 mins',
      startedAt: '2026-01-02T18:00:00Z',
      estimatedArrival: '2026-01-02T19:00:00Z',
      rider: { name: 'Abdul Rahman', rating: 4.7, phone: '+233 24 777 7777' },
      amount: '₵30.00',
      progress: 25
    },
    {
      id: 'GSG-001233',
      status: 'delivered',
      pickup: { address: 'Accra Mall, Tetteh Quarshie', name: 'Fashion Hub' },
      delivery: { address: 'Dansoman, Accra', name: 'Grace Adjei' },
      items: 'Designer Handbag',
      estimatedTime: '25 mins',
      startedAt: '2026-01-01T12:15:00Z',
      deliveredAt: '2026-01-01T12:37:00Z',
      rider: { name: 'Prince Manu', rating: 5.0, phone: '+233 24 111 2222' },
      amount: '₵15.00',
      progress: 100,
      rating: 5
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'picked_up': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'in_transit': return 'In Transit';
      case 'picked_up': return 'Picked Up';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'picked_up': return <Package className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (estimatedArrival: string) => {
    const now = new Date();
    const arrival = new Date(estimatedArrival);
    const diffMs = arrival.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins <= 0) return 'Arriving now';
    if (diffMins < 60) return `${diffMins} mins`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesStatus;
  });

  const activeDeliveries = filteredDeliveries.filter(d => ['in_transit', 'picked_up'].includes(d.status));
  const completedDeliveries = filteredDeliveries.filter(d => d.status === 'delivered');

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
                <h1 className="text-xl font-semibold text-foreground">Live Deliveries</h1>
                <p className="text-sm text-muted-foreground">Real-time delivery status and tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600">
                <Truck className="mr-1 h-3 w-3" />
                {activeDeliveries.length} Active
              </Badge>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="mr-1 h-3 w-3" />
                {completedDeliveries.length} Completed
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="picked_up">Picked Up</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
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

        {/* Active Deliveries Section */}
        {activeDeliveries.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Truck className="mr-2 h-5 w-5 text-blue-600" />
              Active Deliveries ({activeDeliveries.length})
            </h2>
            <div className="grid gap-4">
              {activeDeliveries.map((delivery) => (
                <Card key={delivery.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Left side - Delivery info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-lg">{delivery.id}</h3>
                            <Badge className={getStatusColor(delivery.status)}>
                              {getStatusIcon(delivery.status)}
                              <span className="ml-1">{getStatusText(delivery.status)}</span>
                            </Badge>
                            {delivery.status === 'in_transit' && (
                              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                <Clock className="mr-1 h-3 w-3" />
                                ETA: {getTimeRemaining(delivery.estimatedArrival)}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{delivery.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${delivery.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Route */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              From
                            </div>
                            <p className="font-medium">{delivery.pickup.name}</p>
                            <p className="text-sm text-muted-foreground">{delivery.pickup.address}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              To
                            </div>
                            <p className="font-medium">{delivery.delivery.name}</p>
                            <p className="text-sm text-muted-foreground">{delivery.delivery.address}</p>
                          </div>
                        </div>

                        {/* Items and Rider */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                          <div>
                            <p className="text-sm text-muted-foreground">Items</p>
                            <p className="font-medium">{delivery.items}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Amount</p>
                              <p className="font-bold text-blue-600">{delivery.amount}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{delivery.rider.name}</p>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs">{delivery.rider.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        <Button 
                          onClick={() => onNavigate(`track-order-${delivery.id}`)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Track Live
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          Call Rider
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Completed Deliveries */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
            Recent Deliveries
          </h2>
          <div className="grid gap-4">
            {completedDeliveries.map((delivery) => (
              <Card key={delivery.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg">{delivery.id}</h3>
                          <Badge className={getStatusColor(delivery.status)}>
                            {getStatusIcon(delivery.status)}
                            <span className="ml-1">{getStatusText(delivery.status)}</span>
                          </Badge>
                          {delivery.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{delivery.rating}.0</span>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Route</p>
                          <p className="font-medium">{delivery.pickup.name} → {delivery.delivery.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Items</p>
                          <p className="font-medium">{delivery.items}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Delivered</p>
                          <p className="font-medium">{formatTimestamp(delivery.deliveredAt!)}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                              <User className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="text-sm">{delivery.rider.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Delivered in {delivery.estimatedTime}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{delivery.amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredDeliveries.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No deliveries found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or place a new order.
              </p>
              <Button onClick={() => onNavigate('new-order')}>
                <Package className="mr-2 h-4 w-4" />
                Place New Order
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
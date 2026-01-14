import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Search, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Truck,
  Package,
  CheckCircle,
  ArrowLeft,
  Navigation,
  Star,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface TrackOrdersProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

export function TrackOrders({ onNavigate, onLogout, isDarkMode, toggleTheme }: TrackOrdersProps) {
  const [orderId, setOrderId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample tracking data - replace with real API call
  const sampleTrackingData = {
    'GSG-001235': {
      id: 'GSG-001235',
      status: 'in_transit',
      pickup: { 
        address: 'Kumasi Central Market', 
        name: 'Auntie Akos Shop', 
        phone: '+233 24 444 4444',
        completedAt: '2026-01-02T16:45:00Z'
      },
      delivery: { 
        address: 'KNUST Campus, Kumasi', 
        name: 'Michael Osei', 
        phone: '+233 24 555 5555' 
      },
      items: 'Traditional Kente Cloth',
      amount: '₵18.50',
      rider: { 
        name: 'Joseph Amoah', 
        rating: 4.9, 
        phone: '+233 24 666 6666',
        vehicle: 'Motorcycle - GH 1234-20'
      },
      estimatedArrival: '2026-01-02T17:30:00Z',
      currentLocation: {
        lat: 6.6745,
        lng: -1.5716,
        address: 'Near KNUST Gate, University Road'
      },
      timeline: [
        {
          status: 'order_placed',
          title: 'Order Placed',
          description: 'Your order has been confirmed and is being processed',
          timestamp: '2026-01-02T16:00:00Z',
          completed: true
        },
        {
          status: 'rider_assigned',
          title: 'Rider Assigned',
          description: 'Joseph Amoah has been assigned to your delivery',
          timestamp: '2026-01-02T16:15:00Z',
          completed: true
        },
        {
          status: 'picked_up',
          title: 'Package Picked Up',
          description: 'Package collected from Kumasi Central Market',
          timestamp: '2026-01-02T16:45:00Z',
          completed: true
        },
        {
          status: 'in_transit',
          title: 'In Transit',
          description: 'Package is on the way to destination',
          timestamp: '2026-01-02T16:50:00Z',
          completed: true,
          active: true
        },
        {
          status: 'arriving',
          title: 'Arriving Soon',
          description: 'Rider is approaching your location',
          timestamp: null,
          completed: false
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Package delivered successfully',
          timestamp: null,
          completed: false
        }
      ],
      notes: [
        {
          timestamp: '2026-01-02T16:45:00Z',
          message: 'Package picked up successfully. Traditional Kente cloth in excellent condition.',
          author: 'Joseph Amoah (Rider)'
        },
        {
          timestamp: '2026-01-02T16:50:00Z',
          message: 'On the way to KNUST. Traffic is light, expecting to arrive 5 minutes early.',
          author: 'Joseph Amoah (Rider)'
        }
      ]
    }
  };

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const data = sampleTrackingData[orderId.toUpperCase()];
      if (data) {
        setTrackingResult(data);
        setError('');
      } else {
        setTrackingResult(null);
        setError('Order not found. Please check your order ID and try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
                <h1 className="text-xl font-semibold text-foreground">Track Orders</h1>
                <p className="text-sm text-muted-foreground">Get real-time updates on your deliveries</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Track Your Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter your order ID (e.g., GSG-001235)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                />
              </div>
              <Button onClick={handleTrackOrder} disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Tracking...' : 'Track'}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="space-y-6">
            {/* Order Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order {trackingResult.id}</CardTitle>
                  <Badge className={getStatusColor(trackingResult.status)}>
                    <Truck className="mr-1 h-4 w-4" />
                    {trackingResult.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pickup Details */}
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <h3 className="font-semibold">Pickup Location</h3>
                    </div>
                    <div className="pl-5 space-y-1">
                      <p className="font-medium">{trackingResult.pickup.name}</p>
                      <p className="text-sm text-muted-foreground">{trackingResult.pickup.address}</p>
                      <p className="text-sm text-muted-foreground">{trackingResult.pickup.phone}</p>
                      {trackingResult.pickup.completedAt && (
                        <p className="text-xs text-green-600">
                          ✓ Picked up at {formatTimestamp(trackingResult.pickup.completedAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <h3 className="font-semibold">Delivery Location</h3>
                    </div>
                    <div className="pl-5 space-y-1">
                      <p className="font-medium">{trackingResult.delivery.name}</p>
                      <p className="text-sm text-muted-foreground">{trackingResult.delivery.address}</p>
                      <p className="text-sm text-muted-foreground">{trackingResult.delivery.phone}</p>
                      <p className="text-xs text-blue-600">
                        🕒 ETA: {formatTimestamp(trackingResult.estimatedArrival)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="font-medium">{trackingResult.items}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-bold text-blue-600">{trackingResult.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Location</p>
                      <p className="font-medium">{trackingResult.currentLocation.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rider Information */}
            {trackingResult.rider && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Rider</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{trackingResult.rider.name}</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{trackingResult.rider.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{trackingResult.rider.vehicle}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call Rider
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Live Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Live Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
                  <div className="text-center">
                    <Navigation className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-800 font-medium">Interactive Map</p>
                    <p className="text-sm text-blue-600 mt-1">Real-time rider location and route</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingResult.timeline.map((step: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        step.completed ? 'bg-green-500' : 
                        step.active ? 'bg-blue-500 animate-pulse' : 
                        'bg-gray-300'
                      }`}></div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${
                            step.completed ? 'text-green-800' :
                            step.active ? 'text-blue-800' :
                            'text-gray-600'
                          }`}>
                            {step.title}
                          </h4>
                          {step.timestamp && (
                            <span className="text-sm text-muted-foreground">
                              {formatTimestamp(step.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                        {step.active && (
                          <div className="mt-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Current Status
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Notes */}
            {trackingResult.notes && trackingResult.notes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trackingResult.notes.map((note: any, index: number) => (
                      <div key={index} className="bg-accent/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{note.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(note.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{note.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {!trackingResult && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => onNavigate('my-orders')}
                >
                  <Package className="h-6 w-6" />
                  <span>View All Orders</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => onNavigate('new-order')}
                >
                  <Plus className="h-6 w-6" />
                  <span>Place New Order</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => onNavigate('help-support')}
                >
                  <Phone className="h-6 w-6" />
                  <span>Contact Support</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

// Add missing imports that weren't included
import { Plus } from 'lucide-react';
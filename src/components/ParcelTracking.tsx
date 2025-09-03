import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Search, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  User, 
  Phone, 
  Calendar,
  Navigation,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  date: string;
  time: string;
  isCompleted: boolean;
  icon: 'package' | 'truck' | 'location' | 'check' | 'clock';
}

interface ParcelDetails {
  trackingNumber: string;
  status: 'pending' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'failed';
  sender: {
    name: string;
    phone: string;
    address: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  parcelInfo: {
    weight: string;
    dimensions: string;
    category: string;
    value: string;
    paymentMethod: string;
  };
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingEvents: TrackingEvent[];
  riderInfo?: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
}

// Mock parcel data
const mockParcels: { [key: string]: ParcelDetails } = {
  'GS2024001234': {
    trackingNumber: 'GS2024001234',
    status: 'delivered',
    sender: {
      name: 'Kwame Asante',
      phone: '+233 24 123 4567',
      address: 'Osu, Accra, Ghana'
    },
    recipient: {
      name: 'Ama Osei',
      phone: '+233 20 987 6543',
      address: 'East Legon, Accra, Ghana'
    },
    parcelInfo: {
      weight: '2.5 kg',
      dimensions: '30cm x 20cm x 15cm',
      category: 'Electronics',
      value: '₵ 850.00',
      paymentMethod: 'Mobile Money'
    },
    estimatedDelivery: 'Dec 15, 2024 - 4:00 PM',
    actualDelivery: 'Dec 15, 2024 - 2:30 PM',
    trackingEvents: [
      {
        id: '1',
        status: 'Order Placed',
        description: 'Parcel pickup request created',
        location: 'Osu, Accra',
        timestamp: '2024-12-15T08:00:00Z',
        date: 'Dec 15',
        time: '8:00 AM',
        isCompleted: true,
        icon: 'package'
      },
      {
        id: '2',
        status: 'Picked Up',
        description: 'Parcel collected from sender',
        location: 'Osu, Accra',
        timestamp: '2024-12-15T09:15:00Z',
        date: 'Dec 15',
        time: '9:15 AM',
        isCompleted: true,
        icon: 'truck'
      },
      {
        id: '3',
        status: 'In Transit',
        description: 'Parcel in transit to destination',
        location: 'GlobeSwiftGo Hub - Tema',
        timestamp: '2024-12-15T11:30:00Z',
        date: 'Dec 15',
        time: '11:30 AM',
        isCompleted: true,
        icon: 'location'
      },
      {
        id: '4',
        status: 'Out for Delivery',
        description: 'Parcel out for final delivery',
        location: 'East Legon Area',
        timestamp: '2024-12-15T13:45:00Z',
        date: 'Dec 15',
        time: '1:45 PM',
        isCompleted: true,
        icon: 'truck'
      },
      {
        id: '5',
        status: 'Delivered',
        description: 'Successfully delivered to recipient',
        location: 'East Legon, Accra',
        timestamp: '2024-12-15T14:30:00Z',
        date: 'Dec 15',
        time: '2:30 PM',
        isCompleted: true,
        icon: 'check'
      }
    ],
    riderInfo: {
      name: 'Joseph Mensah',
      phone: '+233 54 321 9876',
      vehicle: 'Motorcycle - GS-2024',
      rating: 4.8
    }
  },
  'GS2024001235': {
    trackingNumber: 'GS2024001235',
    status: 'in-transit',
    sender: {
      name: 'Kofi Addo',
      phone: '+233 26 456 7890',
      address: 'Kumasi Central, Kumasi, Ghana'
    },
    recipient: {
      name: 'Akosua Frimpong',
      phone: '+233 55 234 5678',
      address: 'Spintex, Accra, Ghana'
    },
    parcelInfo: {
      weight: '1.2 kg',
      dimensions: '25cm x 15cm x 10cm',
      category: 'Documents & Books',
      value: '₵ 120.00',
      paymentMethod: 'Cash on Delivery'
    },
    estimatedDelivery: 'Dec 16, 2024 - 3:00 PM',
    trackingEvents: [
      {
        id: '1',
        status: 'Order Placed',
        description: 'Parcel pickup request created',
        location: 'Kumasi Central, Kumasi',
        timestamp: '2024-12-15T14:00:00Z',
        date: 'Dec 15',
        time: '2:00 PM',
        isCompleted: true,
        icon: 'package'
      },
      {
        id: '2',
        status: 'Picked Up',
        description: 'Parcel collected from sender',
        location: 'Kumasi Central, Kumasi',
        timestamp: '2024-12-15T15:30:00Z',
        date: 'Dec 15',
        time: '3:30 PM',
        isCompleted: true,
        icon: 'truck'
      },
      {
        id: '3',
        status: 'In Transit',
        description: 'Parcel in transit to Accra',
        location: 'GlobeSwiftGo Hub - Kumasi',
        timestamp: '2024-12-15T16:45:00Z',
        date: 'Dec 15',
        time: '4:45 PM',
        isCompleted: true,
        icon: 'location'
      },
      {
        id: '4',
        status: 'Processing',
        description: 'Parcel arrived at destination hub',
        location: 'GlobeSwiftGo Hub - Accra',
        timestamp: '2024-12-16T08:00:00Z',
        date: 'Dec 16',
        time: '8:00 AM',
        isCompleted: false,
        icon: 'clock'
      }
    ]
  },
  'GS2024001236': {
    trackingNumber: 'GS2024001236',
    status: 'failed',
    sender: {
      name: 'Abena Nyong',
      phone: '+233 24 765 4321',
      address: 'Tamale, Northern Region, Ghana'
    },
    recipient: {
      name: 'Kwabena Okyere',
      phone: '+233 27 111 2233',
      address: 'Tesano, Accra, Ghana'
    },
    parcelInfo: {
      weight: '0.8 kg',
      dimensions: '20cm x 15cm x 5cm',
      category: 'Fashion & Accessories',
      value: '₵ 280.00',
      paymentMethod: 'Bank Transfer'
    },
    estimatedDelivery: 'Dec 14, 2024 - 5:00 PM',
    trackingEvents: [
      {
        id: '1',
        status: 'Order Placed',
        description: 'Parcel pickup request created',
        location: 'Tamale, Northern Region',
        timestamp: '2024-12-13T10:00:00Z',
        date: 'Dec 13',
        time: '10:00 AM',
        isCompleted: true,
        icon: 'package'
      },
      {
        id: '2',
        status: 'Picked Up',
        description: 'Parcel collected from sender',
        location: 'Tamale, Northern Region',
        timestamp: '2024-12-13T12:15:00Z',
        date: 'Dec 13',
        time: '12:15 PM',
        isCompleted: true,
        icon: 'truck'
      },
      {
        id: '3',
        status: 'Failed Delivery',
        description: 'Recipient not available - Rescheduled',
        location: 'Tesano, Accra',
        timestamp: '2024-12-14T17:30:00Z',
        date: 'Dec 14',
        time: '5:30 PM',
        isCompleted: false,
        icon: 'clock'
      }
    ]
  }
};

export function ParcelTracking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParcel, setSelectedParcel] = useState<ParcelDetails | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a tracking number');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setSelectedParcel(null);

    // Simulate API delay
    setTimeout(() => {
      const parcel = mockParcels[searchQuery.trim().toUpperCase()];
      if (parcel) {
        setSelectedParcel(parcel);
        setSearchError('');
      } else {
        setSearchError('Tracking number not found. Please check and try again.');
        setSelectedParcel(null);
      }
      setIsSearching(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'out-for-delivery': return 'bg-blue-500';
      case 'in-transit': return 'bg-yellow-500';
      case 'picked-up': return 'bg-orange-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'out-for-delivery': return 'Out for Delivery';
      case 'in-transit': return 'In Transit';
      case 'picked-up': return 'Picked Up';
      case 'failed': return 'Failed Delivery';
      default: return 'Pending';
    }
  };

  const getEventIcon = (icon: string) => {
    switch (icon) {
      case 'package': return Package;
      case 'truck': return Truck;
      case 'location': return MapPin;
      case 'check': return CheckCircle;
      default: return Clock;
    }
  };

  const copyTrackingNumber = () => {
    if (selectedParcel) {
      navigator.clipboard.writeText(selectedParcel.trackingNumber);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Parcel Tracking</h1>
          <p className="text-muted-foreground text-lg">Track parcels and monitor delivery status in real-time</p>
        </div>

        {/* Search Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Track Your Parcel
            </CardTitle>
            <CardDescription>Enter your tracking number to get real-time updates on your delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter tracking number (e.g., GS2024001234)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-12 bg-white/80 dark:bg-black/20 border-border/50"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isSearching ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {isSearching ? 'Searching...' : 'Track Parcel'}
              </Button>
            </div>

            {searchError && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                {searchError}
              </div>
            )}

            {/* Demo tracking numbers */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Try these demo tracking numbers:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(mockParcels).map((trackingNumber) => (
                  <Button
                    key={trackingNumber}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery(trackingNumber)}
                    className="text-xs bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40"
                  >
                    {trackingNumber}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tracking Results */}
      {selectedParcel && (
        <div className="space-y-6">
          {/* Status Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-3">
                    Tracking: {selectedParcel.trackingNumber}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyTrackingNumber}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                  <CardDescription>Real-time parcel tracking information</CardDescription>
                </div>
                <Badge className={`${getStatusColor(selectedParcel.status)} text-white`}>
                  {getStatusText(selectedParcel.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Sender
                  </div>
                  <div>
                    <p className="font-medium">{selectedParcel.sender.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedParcel.sender.address}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Recipient
                  </div>
                  <div>
                    <p className="font-medium">{selectedParcel.recipient.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedParcel.recipient.address}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Delivery
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {selectedParcel.actualDelivery ? 'Delivered' : 'Expected'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedParcel.actualDelivery || selectedParcel.estimatedDelivery}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Parcel Info
                  </div>
                  <div>
                    <p className="font-medium text-sm">{selectedParcel.parcelInfo.weight}</p>
                    <p className="text-sm text-muted-foreground">{selectedParcel.parcelInfo.category}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tracking Timeline */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Tracking Timeline
                  </CardTitle>
                  <CardDescription>Follow your parcel's journey step by step</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {selectedParcel.trackingEvents.map((event, index) => {
                      const Icon = getEventIcon(event.icon);
                      const isLast = index === selectedParcel.trackingEvents.length - 1;
                      
                      return (
                        <div key={event.id} className="flex gap-4 relative">
                          {/* Timeline line */}
                          {!isLast && (
                            <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
                          )}
                          
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                            event.isCompleted 
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{event.status}</h4>
                              <div className="text-sm text-muted-foreground">
                                {event.date} • {event.time}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Parcel & Rider Details */}
            <div className="space-y-6">
              {/* Parcel Details */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Parcel Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Weight</span>
                      <span className="text-sm font-medium">{selectedParcel.parcelInfo.weight}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dimensions</span>
                      <span className="text-sm font-medium">{selectedParcel.parcelInfo.dimensions}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span className="text-sm font-medium">{selectedParcel.parcelInfo.category}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Value</span>
                      <span className="text-sm font-medium">{selectedParcel.parcelInfo.value}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Payment</span>
                      <span className="text-sm font-medium">{selectedParcel.parcelInfo.paymentMethod}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rider Information */}
              {selectedParcel.riderInfo && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery Rider</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium">
                        {selectedParcel.riderInfo.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{selectedParcel.riderInfo.name}</p>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= selectedParcel.riderInfo!.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              >
                                ★
                              </div>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground ml-1">
                            {selectedParcel.riderInfo.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {selectedParcel.riderInfo.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        {selectedParcel.riderInfo.vehicle}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Rider
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Contact Support */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <h4 className="font-medium">Need Help?</h4>
                    <p className="text-sm text-muted-foreground">
                      Contact our customer support team for assistance with your delivery.
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Support
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedParcel && !searchError && (
        <Card className="border-2 border-dashed border-border bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Track Your Parcel</h3>
            <p className="text-muted-foreground max-w-md">
              Enter your tracking number above to get detailed information about your parcel's journey and current status.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
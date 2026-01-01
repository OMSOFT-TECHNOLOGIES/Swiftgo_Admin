import { useState, useEffect, useRef } from 'react';
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
import { apiService } from '../services/api';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

// Reverse geocoding function
const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  if (MAPBOX_TOKEN === 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example' || !MAPBOX_TOKEN) {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}&types=poi,address,place,locality,neighborhood&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      // Get the most specific place name available
      const placeName = feature.place_name || feature.text || feature.properties?.address;
      return placeName || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
    
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

// Simple map component for parcel tracking
interface ParcelTrackingMapProps {
  currentLocation?: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address: string;
  };
  className?: string;
}

function ParcelTrackingMap({ currentLocation, className }: ParcelTrackingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState<string>('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Reverse geocode the current location
  useEffect(() => {
    if (!currentLocation) return;
    
    const fetchLocationName = async () => {
      setIsLoadingAddress(true);
      try {
        const locationName = await reverseGeocode(
          currentLocation.coordinates.latitude,
          currentLocation.coordinates.longitude
        );
        setReverseGeocodedAddress(locationName);
      } catch (error) {
        console.error('Failed to reverse geocode:', error);
        setReverseGeocodedAddress(currentLocation.address);
      } finally {
        setIsLoadingAddress(false);
      }
    };
    
    fetchLocationName();
  }, [currentLocation]);

  useEffect(() => {
    if (!mapContainer.current || !currentLocation) return;

    console.log('Initializing map with token:', MAPBOX_TOKEN ? 'Token available' : 'No token');
    console.log('Current location:', currentLocation);

    // Check if Mapbox token is available
    if (MAPBOX_TOKEN === 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example' || !MAPBOX_TOKEN) {
      console.log('Using fallback display - no valid Mapbox token');
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
            <div class="text-center p-6">
              <div class="text-gray-400 mb-2">
                <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Live Location</h3>
              <p class="text-sm text-gray-600 mb-2">
                ${reverseGeocodedAddress || currentLocation.address || 'Loading location...'}
              </p>
              <p class="text-xs text-gray-500">
                Lat: ${currentLocation.coordinates.latitude.toFixed(6)}, Lng: ${currentLocation.coordinates.longitude.toFixed(6)}
              </p>
              <p class="text-xs text-red-500 mt-2">
                Map requires Mapbox token. Set VITE_MAPBOX_TOKEN in environment.
              </p>
            </div>
          </div>
        `;
      }
      return;
    }

    try {
      console.log('Setting Mapbox access token...');
      // Set Mapbox access token
      mapboxgl.accessToken = MAPBOX_TOKEN;

      console.log('Creating map...');
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [currentLocation.coordinates.longitude, currentLocation.coordinates.latitude],
        zoom: 15
      });

      console.log('Map created, adding load event listener...');
      map.current.on('load', () => {
        console.log('Map loaded successfully');
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

      // Add marker for current location after map loads
      map.current.on('load', () => {
        console.log('Adding marker to map...');
        
        const el = document.createElement('div');
        el.className = 'parcel-marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        el.style.backgroundColor = '#3b82f6'; // blue for parcel location
        el.style.animation = 'pulse 2s infinite'; // Add pulse animation for live tracking

        marker.current = new mapboxgl.Marker(el)
          .setLngLat([currentLocation.coordinates.longitude, currentLocation.coordinates.latitude])
          .addTo(map.current!);

        // Create popup with enhanced parcel info
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false
        }).setHTML(`
          <div class="p-3">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <span class="font-semibold text-sm">Live Parcel Location</span>
            </div>
            <div class="text-sm text-gray-700 mb-1">
              <strong>Address:</strong> ${reverseGeocodedAddress || currentLocation.address || 'Loading...'}
            </div>
            <div class="text-xs text-gray-500 mb-2">
              <strong>Coordinates:</strong> ${currentLocation.coordinates.latitude.toFixed(6)}, ${currentLocation.coordinates.longitude.toFixed(6)}
            </div>
            <div class="text-xs text-gray-400">
              <strong>Last Updated:</strong> ${new Date(currentLocation.timestamp).toLocaleString()}
            </div>
            <div class="text-xs text-blue-600 mt-1 font-medium">
              🔴 Live Tracking Active
            </div>
          </div>
        `);

        marker.current.setPopup(popup);

        // Add click event to show popup
        el.addEventListener('click', () => {
          popup.addTo(map.current!);
        });

        console.log('Marker added successfully');
      });

      // Add CSS for pulse animation if not already added
      if (!document.getElementById('pulse-animation-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation-style';
        style.textContent = `
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
          }
        `;
        document.head.appendChild(style);
      }

    } catch (error) {
      console.error('Error initializing map:', error);
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-red-50 rounded-lg border border-red-200">
            <div class="text-center p-6">
              <div class="text-red-400 mb-2">
                <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-red-900 mb-2">Map Error</h3>
              <p class="text-sm text-red-600 mb-2">
                Failed to load map. Please check your Mapbox token.
              </p>
              <p class="text-xs text-red-500">
                Location: ${reverseGeocodedAddress || currentLocation.address || 'Loading...'}
              </p>
            </div>
          </div>
        `;
      }
    }

    // Clean up
    return () => {
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [currentLocation, reverseGeocodedAddress]);

  if (!currentLocation) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Location not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div 
        ref={mapContainer} 
        className={`w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-100 ${className || ''}`}
        style={{ height: '100%', minHeight: '400px' }}
      />
      
      {/* Enhanced location info */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {isLoadingAddress ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-pulse">Loading location...</span>
                  </span>
                ) : (
                  reverseGeocodedAddress || currentLocation.address
                )}
              </p>
              <p className="text-xs text-gray-500">
                {currentLocation.coordinates.latitude.toFixed(6)}, {currentLocation.coordinates.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  currentLocation?: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address: string;
    timestamp: string;
  };
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

  // Helper function to transform API tracking events to our format
  const transformTrackingEvents = (events: any[] = []): TrackingEvent[] => {
    return events.map((event, index) => ({
      id: event.id || index.toString(),
      status: event.status || 'Unknown',
      description: event.description || event.message || 'Status updated',
      location: event.location || 'Unknown location',
      timestamp: event.timestamp || event.created_at || new Date().toISOString(),
      date: event.date || new Date(event.timestamp || event.created_at).toLocaleDateString(),
      time: event.time || new Date(event.timestamp || event.created_at).toLocaleTimeString(),
      isCompleted: event.is_completed || true,
      icon: getEventIconType(event.status)
    }));
  };

  // Helper function to determine icon type from status
  const getEventIconType = (status: string): TrackingEvent['icon'] => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('delivered')) return 'check';
    if (statusLower.includes('transit') || statusLower.includes('delivery')) return 'truck';
    if (statusLower.includes('picked') || statusLower.includes('collected')) return 'truck';
    if (statusLower.includes('pending') || statusLower.includes('created')) return 'package';
    return 'location';
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a tracking number');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setSelectedParcel(null);

    try {
      const response = await apiService.trackParcel(searchQuery.trim());
      
      if (response.success) {
        // Transform the API response to match our interface
        console.log('Tracking response:', response);
        const parcel = response.parcel;
        const riderInfo = response.rider_info;
        
        const parcelData: ParcelDetails = {
          trackingNumber: parcel.tracking_number || searchQuery.trim(),
          status: parcel.status?.toLowerCase().replace('_', '-') || 'pending',
          sender: {
            name: parcel.customer?.name || 'Unknown',
            phone: parcel.customer?.phone || 'N/A',
            address: parcel.pickup_address || 'N/A'
          },
          recipient: {
            name: parcel.delivery_info?.name || 'Unknown',
            phone: parcel.delivery_info?.phone || 'N/A',
            address: parcel.delivery_address || 'N/A'
          },
          parcelInfo: {
            weight: parcel.weight || 'N/A',
            dimensions: parcel.dimensions || 'N/A',
            category: parcel.parcel_size || 'N/A',
            value: `GHC ${parcel.delivery_fee || 0}`,
            paymentMethod: parcel.payment_method || 'N/A'
          },
          estimatedDelivery: parcel.estimated_delivery || 'N/A',
          actualDelivery: parcel.delivered_at || undefined,
          trackingEvents: transformTrackingEvents(parcel.tracking_events),
          currentLocation: parcel.current_location ? {
            coordinates: {
              latitude: parcel.current_location.coordinates.latitude,
              longitude: parcel.current_location.coordinates.longitude
            },
            address: parcel.current_location.address,
            timestamp: parcel.current_location.timestamp
          } : undefined,
          riderInfo: riderInfo ? {
            name: riderInfo.name,
            phone: riderInfo.phone || 'N/A',
            vehicle: riderInfo.vehicle ? `${riderInfo.vehicle.model} - ${riderInfo.vehicle.plate_number}` : 'N/A',
            rating: riderInfo.rating || 0
          } : undefined
        };
        
        setSelectedParcel(parcelData);
        setSearchError('');
        toast.success('Tracking information loaded successfully');
      } else {
        setSearchError(response.message || 'Tracking number not found. Please check and try again.');
        setSelectedParcel(null);
        toast.error('Parcel not found');
      }
    } catch (error: any) {
      console.error('Tracking error:', error);
      const errorMessage = error.message || 'Failed to fetch tracking information. Please try again.';
      setSearchError(errorMessage);
      setSelectedParcel(null);
      toast.error('Failed to fetch tracking information');
    } finally {
      setIsSearching(false);
    }
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

          {/* Main tracking layout - following Live Rider Tracking structure */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:min-h-screen">
            {/* Map Area - takes 2/3 of the space */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="h-[600px] shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Live Location Tracking
                      </CardTitle>
                      <CardDescription className="text-base">
                        Real-time parcel location tracking
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {/* Add refresh function */}}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="h-full p-4">
                  <ParcelTrackingMap currentLocation={selectedParcel.currentLocation} className="w-full h-full" />
                  {selectedParcel.currentLocation && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      Last updated: {new Date(selectedParcel.currentLocation.timestamp).toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Details Panel - takes 1/3 of the space with sticky positioning */}
            <div className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)]">
              <Card className="h-auto shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Tracking Details</CardTitle>
                  <CardDescription className="text-base">Timeline and information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 overflow-y-auto max-h-[500px] lg:max-h-[calc(100vh-12rem)]">
                  {/* Tracking Timeline - Condensed */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Timeline
                    </h3>
                    <div className="space-y-3">
                      {selectedParcel.trackingEvents.map((event, index) => {
                        const Icon = getEventIcon(event.icon);
                        const isLast = index === selectedParcel.trackingEvents.length - 1;
                        
                        return (
                          <div key={event.id} className="flex gap-3 relative">
                            {/* Timeline line */}
                            {!isLast && (
                              <div className="absolute left-4 top-8 w-0.5 h-6 bg-border" />
                            )}
                            
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              event.isCompleted 
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                            }`}>
                              <Icon className="h-3 w-3" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate">{event.status}</h4>
                                <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {event.time}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">{event.description}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-2 w-2" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Parcel Details - Condensed */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Parcel Info</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-medium">{selectedParcel.parcelInfo.weight}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{selectedParcel.parcelInfo.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Value</span>
                        <span className="font-medium">{selectedParcel.parcelInfo.value}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment</span>
                        <span className="font-medium">{selectedParcel.parcelInfo.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rider Information */}
                  {selectedParcel.riderInfo && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Delivery Rider</h3>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                            {selectedParcel.riderInfo.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{selectedParcel.riderInfo.name}</p>
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <div
                                    key={star}
                                    className={`w-2 h-2 ${
                                      star <= selectedParcel.riderInfo!.rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </div>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground ml-1">
                                {selectedParcel.riderInfo.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{selectedParcel.riderInfo.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{selectedParcel.riderInfo.vehicle}</span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full" size="sm">
                          <Phone className="h-3 w-3 mr-2" />
                          Contact Rider
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Quick Actions */}
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Maps
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-3 w-3 mr-1" />
                        Support
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
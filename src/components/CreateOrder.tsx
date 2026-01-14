import { useState, useEffect, useCallback } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { GooglePlacesInput } from './GooglePlacesInput';
import { GoogleMapSelector } from './GoogleMapSelector';
import { RidersMap } from './RidersMap';
import { 
  MapPin, 
  User, 
  Phone, 
  Package, 
  Clock, 
  CreditCard, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  Truck,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface CreateOrderProps {
  onBack: () => void;
}

interface OrderData {
  // Sender details
  sender_name: string;
  sender_phone: string;
  pickup_address: string;
  sender_remarks: string;
  pickup_coordinates: { lat: number; lng: number };
  pickup_latitude: number;
  pickup_longitude: number;

  // Receiver details
  receiver_name: string;
  receiver_phone: string;
  delivery_address: string;
  receiver_remarks: string;
  delivery_coordinates: { lat: number; lng: number };
  delivery_latitude: number;
  delivery_longitude: number;

  // Parcel details
  parcel_size: 'small' | 'medium' | 'large';
  weight: number;
  description: string;

  // Delivery options
  collection_time: 'express' | 'schedule';
  scheduled_pickup: string | null;

  // Payment
  payment_method: 'cash' | 'card';
  delivery_fee: number;
  payment_reference?: string;
  transaction_id?: string;
}

export function CreateOrder({ onBack }: CreateOrderProps) {
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [estimate, setEstimate] = useState<any>(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [nearbyRiders, setNearbyRiders] = useState<any[]>([]);
  const [ridersLoading, setRidersLoading] = useState(false);
  const [currentSearchRadius, setCurrentSearchRadius] = useState(0);
  const [searchComplete, setSearchComplete] = useState(false);
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDeliveryMap, setShowDeliveryMap] = useState(false);

  const [orderData, setOrderData] = useState<OrderData>({
    sender_name: '',
    sender_phone: '',
    pickup_address: '',
    sender_remarks: '',
    pickup_coordinates: { lat: 5.6037, lng: -0.1870 }, // Default Accra coordinates
    pickup_latitude: 5.6037,
    pickup_longitude: -0.1870,

    receiver_name: '',
    receiver_phone: '',
    delivery_address: '',
    receiver_remarks: '',
    delivery_coordinates: { lat: 5.6037, lng: -0.1870 },
    delivery_latitude: 5.6037,
    delivery_longitude: -0.1870,

    parcel_size: 'medium',
    weight: 2.5,
    description: 'Medium Package',

    collection_time: 'express',
    scheduled_pickup: null,

    payment_method: 'cash',
    delivery_fee: 62.7,
  });

  const updateOrderData = (field: keyof OrderData, value: any) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const handlePickupLocationSelect = (address: string, coordinates: { lat: number; lng: number }) => {
    console.log('Pickup location selected:', { address, coordinates });
    updateOrderData('pickup_address', address);
    updateOrderData('pickup_coordinates', coordinates);
    updateOrderData('pickup_latitude', coordinates.lat);
    updateOrderData('pickup_longitude', coordinates.lng);
  };

  const handleDeliveryLocationSelect = (address: string, coordinates: { lat: number; lng: number }) => {
    console.log('Delivery location selected:', { address, coordinates });
    updateOrderData('delivery_address', address);
    updateOrderData('delivery_coordinates', coordinates);
    updateOrderData('delivery_latitude', coordinates.lat);
    updateOrderData('delivery_longitude', coordinates.lng);
  };

  const getEstimate = useCallback(async () => {
    if (!token || !orderData.pickup_address || !orderData.delivery_address || !orderData.parcel_size) {
      return;
    }

    // Validate coordinates are different for pickup and delivery
    const pickup = orderData.pickup_coordinates;
    const delivery = orderData.delivery_coordinates;
    
    if (pickup.lat === delivery.lat && pickup.lng === delivery.lng) {
      console.warn('Pickup and delivery coordinates are the same, skipping estimate');
      return;
    }

    setEstimateLoading(true);
    try {
      const estimateData = {
        pickup_address: orderData.pickup_address,
        delivery_address: orderData.delivery_address,
        parcel_size: orderData.parcel_size,
        weight: orderData.weight,
        pickup_coordinates: orderData.pickup_coordinates,
        delivery_coordinates: orderData.delivery_coordinates,
      };

      console.log('Getting estimate with data:', estimateData);
      const result = await apiService.getDeliveryEstimate(token, estimateData);
      setEstimate(result);
      
      // Don't update orderData here to prevent infinite loop
      // The delivery_fee will be calculated from estimate in calculateDeliveryFee
    } catch (error) {
      console.error('Failed to get estimate:', error);
    } finally {
      setEstimateLoading(false);
    }
  }, [token, orderData.pickup_address, orderData.delivery_address, orderData.parcel_size, orderData.weight, orderData.pickup_coordinates, orderData.delivery_coordinates]);

  // Get nearby riders using sender's coordinates with progressive radius search
  const getNearbyRiders = useCallback(async () => {
    if (!token || !orderData.pickup_coordinates) {
      return;
    }

    setRidersLoading(true);
    setSearchComplete(false);
    setNearbyRiders([]);
    
    const searchRadii = [2, 4, 6, 8, 10, 15, 20]; // km
    const allFoundRiders: any[] = [];

    try {
      for (const radius of searchRadii) {
        setCurrentSearchRadius(radius);
        
        // Small delay for animation effect
        await new Promise(resolve => setTimeout(resolve, 800));
        
        try {
          const result = await apiService.getNearbyRiders(
            orderData.pickup_coordinates.lat,
            orderData.pickup_coordinates.lng,
            radius,
            token
          );
          
          const riders = result.riders || [];
          console.log(`Found ${riders.length} riders within ${radius}km`);
          
          // Add new riders that aren't already in our list
          const newRiders = riders.filter((rider: any) => 
            !allFoundRiders.some(existing => existing.id === rider.id)
          );
          
          if (newRiders.length > 0) {
            allFoundRiders.push(...newRiders.map((rider: any) => ({
              ...rider,
              searchRadius: radius
            })));
            setNearbyRiders([...allFoundRiders]);
          }
          
          // If we found enough riders, stop searching
          if (allFoundRiders.length >= 10) {
            break;
          }
        } catch (radiusError) {
          console.error(`Failed to search ${radius}km radius:`, radiusError);
        }
      }
      
      console.log(`Final search complete. Found ${allFoundRiders.length} total riders`);
    } catch (error) {
      console.error('Failed to get nearby riders:', error);
    } finally {
      setRidersLoading(false);
      setSearchComplete(true);
      setCurrentSearchRadius(0);
    }
  }, [token, orderData.pickup_coordinates]);

  // Auto-get estimate when key data changes
  useEffect(() => {
    const pickup = orderData.pickup_coordinates;
    const delivery = orderData.delivery_coordinates;
    
    // Only get estimate if we have valid data and different coordinates
    const hasValidData = currentStep >= 2 && 
        orderData.pickup_address && 
        orderData.delivery_address && 
        orderData.parcel_size && 
        orderData.weight > 0;
        
    const hasValidCoordinates = pickup.lat !== delivery.lat || pickup.lng !== delivery.lng;
    
    if (hasValidData && hasValidCoordinates) {
      const timer = setTimeout(() => {
        getEstimate();
      }, 1000); // Debounce to avoid too many API calls
      
      return () => clearTimeout(timer);
    }
  }, [
    currentStep, 
    orderData.pickup_address, 
    orderData.delivery_address, 
    orderData.parcel_size, 
    orderData.weight, 
    orderData.pickup_coordinates,
    orderData.delivery_coordinates,
    getEstimate
  ]);

  // Get nearby riders when reaching step 3 (confirmation)
  useEffect(() => {
    if (currentStep === 3 && orderData.pickup_coordinates && token) {
      getNearbyRiders();
    }
  }, [currentStep, getNearbyRiders, orderData.pickup_coordinates, token]);

  const calculateDeliveryFee = () => {
    // Use backend estimate if available
    if (estimate && estimate.estimate && estimate.estimate.delivery_fee) {
      return estimate.estimate.delivery_fee;
    }
    
    // Fallback calculation
    const baseFee = 30;
    const sizeFee = orderData.parcel_size === 'small' ? 10 : orderData.parcel_size === 'medium' ? 20 : 40;
    const weightFee = Math.ceil(orderData.weight) * 5;
    const expressFee = orderData.collection_time === 'express' ? 15 : 0;
    
    const total = baseFee + sizeFee + weightFee + expressFee;
    return total;
  };

  const nextStep = () => {
    if (currentStep < 3) {
      if (currentStep === 2) {
        const finalFee = calculateDeliveryFee();
        // Update the delivery fee in orderData when moving to step 3
        updateOrderData('delivery_fee', finalFee);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    if (!token) {
      setError('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      // Prepare the data for the API call
      const parcelData = {
        pickup_address: orderData.pickup_address,
        delivery_address: orderData.delivery_address,
        pickup_coordinates: orderData.pickup_coordinates,
        delivery_coordinates: orderData.delivery_coordinates,
        pickup_latitude: orderData.pickup_latitude,
        pickup_longitude: orderData.pickup_longitude,
        delivery_latitude: orderData.delivery_latitude,
        delivery_longitude: orderData.delivery_longitude,
        sender_name: orderData.sender_name,
        sender_phone: orderData.sender_phone,
        receiver_name: orderData.receiver_name,
        receiver_phone: orderData.receiver_phone,
        receiver_remarks: orderData.receiver_remarks,
        collection_time: orderData.collection_time,
        delivery_fee: orderData.delivery_fee,
        description: orderData.description,
        parcel_size: orderData.parcel_size,
        payment_method: orderData.payment_method,
        scheduled_pickup: orderData.scheduled_pickup,
        sender_remarks: orderData.sender_remarks,
        weight: orderData.weight
      };

      console.log('Creating parcel:', parcelData);
      
      // Make the API call
      const response = await apiService.createParcel(token, parcelData);
      console.log('Parcel created successfully:', response);
      
      setSuccess(true);
    } catch (err: any) {
      console.error('Failed to create parcel:', err);
      setError(err?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          orderData.sender_name.trim() && 
          orderData.sender_phone.trim() && 
          orderData.pickup_address.trim() &&
          orderData.receiver_name.trim() && 
          orderData.receiver_phone.trim() && 
          orderData.delivery_address.trim()
        );
      case 2:
        return orderData.parcel_size && orderData.weight > 0;
      case 3:
        return orderData.payment_method;
      default:
        return false;
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Order Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Your parcel delivery has been scheduled. You'll receive a confirmation shortly.
            </p>
            <Button onClick={onBack} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Create New Order</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step <= currentStep 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : step === 1 ? (
                <User className="h-5 w-5" />
              ) : step === 2 ? (
                <Package className="h-5 w-5" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
            </div>
            <div className="ml-2 mr-6">
              <div className={`text-sm font-medium ${
                step <= currentStep ? 'text-green-600' : 'text-gray-500'
              }`}>
                STEP {step}
              </div>
              <div className={`text-xs ${
                step <= currentStep ? 'text-green-600' : 'text-gray-400'
              }`}>
                {step === 1 ? 'Basic Details' : step === 2 ? 'Information' : 'Confirmation'}
              </div>
            </div>
            {step < 3 && (
              <div className={`w-8 h-0.5 ${
                step < currentStep ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 ? 'Select Location' : 
             currentStep === 2 ? 'Parcel Details' : 
             'Confirmation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Sender Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Sender's details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender_name">Sender name</Label>
                    <Input
                      id="sender_name"
                      placeholder="Enter sender's name"
                      value={orderData.sender_name}
                      onChange={(e) => updateOrderData('sender_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender_phone">Sender phone</Label>
                    <Input
                      id="sender_phone"
                      placeholder="Enter sender's phone number"
                      value={orderData.sender_phone}
                      onChange={(e) => updateOrderData('sender_phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickup_address">Sender address</Label>
                  <GooglePlacesInput
                    id="pickup_address"
                    placeholder="Enter pickup location"
                    value={orderData.pickup_address}
                    onChange={(address, coordinates) => {
                      console.log('Pickup address changed:', { address, coordinates });
                      updateOrderData('pickup_address', address);
                      if (coordinates) {
                        updateOrderData('pickup_coordinates', coordinates);
                        updateOrderData('pickup_latitude', coordinates.lat);
                        updateOrderData('pickup_longitude', coordinates.lng);
                      }
                    }}
                    onMapClick={() => setShowPickupMap(true)}
                  />
                </div>
              </div>

              {/* Receiver Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Receiver's details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiver_name">Receiver name</Label>
                    <Input
                      id="receiver_name"
                      placeholder="Enter receiver's name"
                      value={orderData.receiver_name}
                      onChange={(e) => updateOrderData('receiver_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiver_phone">Receiver phone</Label>
                    <Input
                      id="receiver_phone"
                      placeholder="Enter receiver's phone number"
                      value={orderData.receiver_phone}
                      onChange={(e) => updateOrderData('receiver_phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery_address">Receiver address</Label>
                  <GooglePlacesInput
                    id="delivery_address"
                    placeholder="Enter delivery location"
                    value={orderData.delivery_address}
                    onChange={(address, coordinates) => {
                      console.log('Delivery address changed:', { address, coordinates });
                      updateOrderData('delivery_address', address);
                      if (coordinates) {
                        updateOrderData('delivery_coordinates', coordinates);
                        updateOrderData('delivery_latitude', coordinates.lat);
                        updateOrderData('delivery_longitude', coordinates.lng);
                      }
                    }}
                    onMapClick={() => setShowDeliveryMap(true)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Parcel Details */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {/* Parcel Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Parcel details</h3>
                
                {/* Parcel Size */}
                <div className="space-y-3">
                  <Label>Parcel size</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {['small', 'medium', 'large'].map((size) => (
                      <Button
                        key={size}
                        variant={orderData.parcel_size === size ? 'default' : 'outline'}
                        className={`h-12 ${orderData.parcel_size === size ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => updateOrderData('parcel_size', size)}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-3">
                  <Label>Weight (kg)</Label>
                  <div className="flex items-center space-x-4 bg-muted rounded-lg p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateOrderData('weight', Math.max(0.5, orderData.weight - 0.5))}
                      disabled={orderData.weight <= 0.5}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-semibold">{orderData.weight} kg</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateOrderData('weight', orderData.weight + 0.5)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Collect Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Collect time</h3>
                <RadioGroup
                  value={orderData.collection_time}
                  onValueChange={(value) => updateOrderData('collection_time', value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    orderData.collection_time === 'express' ? 'border-green-600 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="font-medium cursor-pointer">Express</Label>
                      {orderData.collection_time === 'express' && (
                        <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                      )}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Collect time 10-20 min</p>
                      <p>Delivery to receiver 1-2 hours</p>
                    </div>
                  </div>

                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    orderData.collection_time === 'schedule' ? 'border-green-600 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="schedule" id="schedule" />
                      <Label htmlFor="schedule" className="font-medium cursor-pointer">Schedule</Label>
                      {orderData.collection_time === 'schedule' && (
                        <div className="h-4 w-4 border-2 border-green-600 rounded-full ml-auto" />
                      )}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Choose available time</p>
                      <p>$ Flexible price</p>
                      <p>Plan 2 day ahead</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Price Preview */}
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Estimated Price</h4>
                  {estimateLoading && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
                      Loading...
                    </div>
                  )}
                </div>
                
                {estimate && (
                  <div className="space-y-2 text-sm">
                    {estimate.distance && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance:</span>
                        <span>{estimate.distance} km</span>
                      </div>
                    )}
                    {estimate.estimated_time && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. Time:</span>
                        <span>{estimate.estimated_time}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-semibold text-green-600">
                    {estimateLoading ? 'Calculating...' : `GHC ${calculateDeliveryFee().toFixed(2)}`}
                  </span>
                </div>
                
                {!estimate && !estimateLoading && orderData.pickup_address && orderData.delivery_address && (
                  <div className="text-xs text-amber-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Using estimated pricing. Accurate quote on next step.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Address Details */}
              <div className="bg-muted rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">Address details</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-4 h-4 bg-green-600 rounded-full mt-1"></div>
                    <div className="flex-1">
                      <p className="font-medium">Collect from</p>
                      <p className="text-sm text-muted-foreground">Sender: {orderData.sender_name}</p>
                      <p className="font-medium">{orderData.pickup_address}</p>
                      <p className="text-sm text-muted-foreground">Phone: {orderData.sender_phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-4 h-4 bg-green-600 rounded-full mt-1"></div>
                    <div className="flex-1">
                      <p className="font-medium">Delivery to</p>
                      <p className="text-sm text-muted-foreground">Receiver: {orderData.receiver_name}</p>
                      <p className="font-medium">{orderData.delivery_address}</p>
                      <p className="text-sm text-muted-foreground">Phone: {orderData.receiver_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Button variant="outline" className="w-full">
                    <Truck className="h-4 w-4 mr-2" />
                    Take around 20 min
                  </Button>
                </div>
              </div>

              {/* Nearby Riders */}
              <div className="bg-muted rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">Nearby Riders</h3>
                
                {/* Search Status */}
                {ridersLoading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                      <div className="text-sm">
                        <span className="font-medium text-green-600">
                          Searching riders within {currentSearchRadius}km
                        </span>
                        <div className="flex space-x-1 mt-1">
                          <div className="h-1 w-1 bg-green-600 rounded-full animate-pulse"></div>
                          <div className="h-1 w-1 bg-green-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="h-1 w-1 bg-green-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Map Display */}
                {searchComplete && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Riders Location Map</h4>
                      {nearbyRiders.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {nearbyRiders.length} rider{nearbyRiders.length > 1 ? 's' : ''} found
                        </Badge>
                      )}
                    </div>
                    
                    <RidersMap 
                      pickupCoordinates={orderData.pickup_coordinates}
                      riders={nearbyRiders}
                      className="border rounded-lg overflow-hidden"
                    />

                    {/* No Riders Message */}
                    {nearbyRiders.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">No riders found within 20km</p>
                        <p className="text-xs">We'll assign the nearest available rider when your order is placed</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Riders List */}
                {searchComplete && nearbyRiders.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Available Riders</h4>
                    <div className="grid gap-3 max-h-48 overflow-y-auto">
                      {nearbyRiders.slice(0, 8).map((rider, index) => (
                        <div key={rider.id || index} className="flex items-center space-x-3 p-3 bg-background rounded-lg border">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{rider.name || `Rider ${index + 1}`}</p>
                            <p className="text-xs text-muted-foreground">
                              {rider.distance ? `${rider.distance.toFixed(1)}km away` : 'Distance unknown'}
                              {rider.searchRadius && ` • Found within ${rider.searchRadius}km`}
                              {rider.phone && ` • ${rider.phone}`}
                            </p>
                          </div>
                          <Badge variant={rider.status === 'available' ? 'default' : 'secondary'} className="text-xs">
                            {rider.status || 'Available'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment method</h3>
                <RadioGroup
                  value={orderData.payment_method}
                  onValueChange={(value) => updateOrderData('payment_method', value)}
                  className="space-y-3"
                >
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    orderData.payment_method === 'cash' ? 'border-green-600 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-6 bg-green-600 rounded flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="cash" className="font-medium cursor-pointer">Cash on Delivery</Label>
                        </div>
                      </div>
                      <RadioGroupItem value="cash" id="cash" />
                    </div>
                  </div>

                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    orderData.payment_method === 'card' ? 'border-green-600 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="card" className="font-medium cursor-pointer">Visa/Mastercard/JCB</Label>
                        </div>
                      </div>
                      <div className={`w-4 h-4 border-2 rounded-full ${
                        orderData.payment_method === 'card' ? 'border-green-600' : 'border-gray-300'
                      }`} />
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Order Summary */}
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Order Summary</h4>
                  {estimateLoading && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
                      Calculating...
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Parcel size:</span>
                  <span className="font-medium">{orderData.parcel_size.charAt(0).toUpperCase() + orderData.parcel_size.slice(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Weight:</span>
                  <span className="font-medium">{orderData.weight} kg</span>
                </div>
                {estimate && estimate.distance && (
                  <div className="flex justify-between text-sm">
                    <span>Distance:</span>
                    <span className="font-medium">{estimate.distance} km</span>
                  </div>
                )}
                {estimate && estimate.estimated_time && (
                  <div className="flex justify-between text-sm">
                    <span>Est. Delivery:</span>
                    <span className="font-medium">{estimate.estimated_time}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Collection:</span>
                  <span className="font-medium">{orderData.collection_time === 'express' ? 'Express (10-20 min)' : 'Scheduled'}</span>
                </div>
                
                {/* Estimate Breakdown */}
                {estimate && estimate.breakdown && (
                  <div className="pt-2 border-t text-xs space-y-1">
                    <div className="text-gray-600 font-medium">Price Breakdown:</div>
                    {estimate.breakdown.base_price && (
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span>GHC {estimate.breakdown.base_price.toFixed(2)}</span>
                      </div>
                    )}
                    {estimate.breakdown.distance_fee && (
                      <div className="flex justify-between">
                        <span>Distance Fee:</span>
                        <span>GHC {estimate.breakdown.distance_fee.toFixed(2)}</span>
                      </div>
                    )}
                    {estimate.breakdown.size_fee && (
                      <div className="flex justify-between">
                        <span>Size Fee:</span>
                        <span>GHC {estimate.breakdown.size_fee.toFixed(2)}</span>
                      </div>
                    )}
                    {estimate.breakdown.urgent_fee && orderData.collection_time === 'express' && (
                      <div className="flex justify-between">
                        <span>Express Fee:</span>
                        <span>GHC {estimate.breakdown.urgent_fee.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total (incl. VAT)</span>
                  <span className="text-green-600">
                    {estimateLoading ? 'Calculating...' : `GHC ${orderData.delivery_fee.toFixed(2)}`}
                  </span>
                </div>
                
                {!estimate && !estimateLoading && (
                  <div className="text-xs text-amber-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Using estimated pricing. Final cost may vary.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <Button 
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="bg-green-600 hover:bg-green-700"
              >
                Process Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={loading || !validateStep(currentStep)}
                className="bg-green-600 hover:bg-green-700 min-w-[120px]"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Book'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Google Map Selectors */}
      <GoogleMapSelector
        isOpen={showPickupMap}
        onClose={() => setShowPickupMap(false)}
        onLocationSelect={handlePickupLocationSelect}
        title="Select Pickup Location"
        initialValue={orderData.pickup_address}
      />

      <GoogleMapSelector
        isOpen={showDeliveryMap}
        onClose={() => setShowDeliveryMap(false)}
        onLocationSelect={handleDeliveryLocationSelect}
        title="Select Delivery Location"
        initialValue={orderData.delivery_address}
      />
    </div>
  );
}
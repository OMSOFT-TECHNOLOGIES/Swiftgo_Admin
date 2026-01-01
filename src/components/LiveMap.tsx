import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin, Clock, Package, Filter, RefreshCw, Loader2, Star } from 'lucide-react';
import { useActiveRiders } from '../hooks/useActiveRiders';
import { MapboxMap } from './MapboxMap';
import { useAuth } from '../hooks/useAuth';

const getStatusBadge = (status: string, availability: boolean) => {
  if (status === 'ACTIVE' || status === 'ONLINE') {
    return availability ? 
      <Badge className="bg-green-100 text-green-800">Available</Badge> :
      <Badge className="bg-blue-100 text-blue-800">On Delivery</Badge>;
  }
  if (status === 'OFFLINE' || status === 'SUSPENDED') {
    return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
  }
  return <Badge>Unknown</Badge>;
};

// Generate avatar URL based on rider name
const getAvatarUrl = (name: string) => {
  const seed = name.replace(/\s+/g, '').toLowerCase();
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=3b82f6&fontFamily=Arial&fontSize=50`;
};

export function LiveMap() {
  const { isAuthenticated, token } = useAuth();
  const { riders, loading, error, lastUpdate, refresh } = useActiveRiders();
  const [selectedRider, setSelectedRider] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Show authentication required message if not authenticated
  if (!isAuthenticated || !token) {
    return (
      <div className="p-6 lg:p-8 space-y-8 w-full max-w-none">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground">Please log in to view live rider tracking.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredRiders = riders.filter(rider => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return rider.status === 'ACTIVE' || rider.status === 'ONLINE';
    if (statusFilter === 'busy') return !rider.availability;
    if (statusFilter === 'offline') return rider.status === 'OFFLINE' || rider.status === 'SUSPENDED';
    return rider.status === statusFilter.toUpperCase();
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-none">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Live Rider Tracking</h1>
          <p className="text-muted-foreground text-lg">Real-time location and status of all riders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Live • Updated {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">Live Map View</CardTitle>
                  <CardDescription className="text-base">Real-time rider locations in Greater Accra Region</CardDescription>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter riders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Riders</SelectItem>
                    <SelectItem value="active">Available</SelectItem>
                    <SelectItem value="busy">On Delivery</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="h-full p-4">
              <MapboxMap 
                riders={filteredRiders}
                selectedRider={selectedRider}
                onRiderSelect={setSelectedRider}
                className="w-full h-full"
              />
            </CardContent>
          </Card>
        </div>

        {/* Rider List Panel */}
        <div>
          <Card className="h-[600px] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Active Riders ({filteredRiders.length})</CardTitle>
              <CardDescription className="text-base">Current rider status and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto max-h-[500px]">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading riders...</span>
                </div>
              ) : error ? (
                <div className="text-center p-4">
                  <p className="text-red-500">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refresh}
                    className="mt-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : filteredRiders.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No riders found</p>
                </div>
              ) : (
                filteredRiders.map((rider) => (
                  <Card 
                    key={rider.id} 
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedRider === rider.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedRider(rider.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={getAvatarUrl(rider.name)} />
                              <AvatarFallback>{rider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{rider.name}</p>
                              <p className="text-sm text-muted-foreground">{rider.email}</p>
                            </div>
                          </div>
                          {getStatusBadge(rider.status, rider.availability)}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              <span>Deliveries</span>
                            </div>
                            <span className="font-medium">
                              {rider.performance?.completed_deliveries || rider.completed_deliveries || 0}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>Rating</span>
                            </div>
                            <span className="font-medium">
                              {rider.performance?.average_rating || rider.average_rating ? 
                                (rider.performance?.average_rating || rider.average_rating)!.toFixed(1) : 'N/A'}
                            </span>
                          </div>

                          {!rider.availability && (
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                <span>Status</span>
                              </div>
                              <span className="font-medium text-blue-600">On Delivery</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>Location</span>
                            </div>
                            <span className="font-medium">
                              {rider.current_location?.coordinates ? 'GPS Available' : 'No GPS'}
                            </span>
                          </div>

                          {rider.current_location?.address && (
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>Address</span>
                              </div>
                              <span className="text-muted-foreground text-xs">
                                {rider.current_location.address}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Verified</span>
                            </div>
                            <span className="text-muted-foreground">
                              {rider.is_verified !== undefined ? (rider.is_verified ? 'Yes' : 'No') : 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            Track
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Legend and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Map Legend</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Available Riders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">On Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm">Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-green-600" />
                  <span className="text-sm">
                    {riders.filter(r => r.current_location?.coordinates?.latitude && r.current_location?.coordinates?.longitude).length}/{riders.length} with GPS
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
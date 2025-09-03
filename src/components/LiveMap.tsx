import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin, Navigation, Clock, Package, Zap, Filter, RefreshCw } from 'lucide-react';

// Mock rider locations for the map
const riderLocations = [
  {
    id: 'R001',
    name: 'Kwame Asante',
    lat: 5.6037,
    lng: -0.1870,
    status: 'active',
    currentOrder: 'ORD-001',
    speed: '40 km/h',
    batteryLevel: 85,
    lastUpdate: '2 mins ago',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'R002',
    name: 'Ama Serwaa',
    lat: 5.5502,
    lng: -0.2174,
    status: 'busy',
    currentOrder: 'ORD-002',
    speed: '25 km/h',
    batteryLevel: 72,
    lastUpdate: '1 min ago',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'R003',
    name: 'Yaw Boateng',
    lat: 5.6691,
    lng: -0.0266,
    status: 'active',
    currentOrder: null,
    speed: '0 km/h',
    batteryLevel: 91,
    lastUpdate: '5 mins ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'R004',
    name: 'Kojo Mensah',
    lat: 5.5850,
    lng: -0.2420,
    status: 'busy',
    currentOrder: 'ORD-005',
    speed: '45 km/h',
    batteryLevel: 64,
    lastUpdate: '3 mins ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800">Available</Badge>;
    case 'busy':
      return <Badge className="bg-blue-100 text-blue-800">On Delivery</Badge>;
    case 'offline':
      return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const getBatteryColor = (level: number) => {
  if (level > 60) return 'text-green-500';
  if (level > 30) return 'text-yellow-500';
  return 'text-red-500';
};

export function LiveMap() {
  const [selectedRider, setSelectedRider] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredRiders = riderLocations.filter(rider => 
    statusFilter === 'all' || rider.status === statusFilter
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-none">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Live Rider Tracking</h1>
          <p className="text-muted-foreground text-lg">Real-time location and status of all riders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
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
            <CardContent className="h-full">
              {/* Mock Map Interface */}
              <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="font-semibold">Interactive Map</h3>
                    <p className="text-sm text-muted-foreground">
                      In a real application, this would show an interactive map<br />
                      with rider locations using services like Google Maps or Mapbox
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {filteredRiders.map((rider, index) => (
                      <div 
                        key={rider.id}
                        className={`absolute cursor-pointer transition-all duration-300 ${
                          selectedRider === rider.id ? 'scale-110 z-10' : ''
                        }`}
                        style={{
                          left: `${20 + (index * 20)}%`,
                          top: `${30 + (index * 15)}%`,
                        }}
                        onClick={() => setSelectedRider(rider.id)}
                      >
                        <div className="relative">
                          <div className={`w-3 h-3 rounded-full animate-pulse ${
                            rider.status === 'active' ? 'bg-green-500' : 
                            rider.status === 'busy' ? 'bg-blue-500' : 'bg-gray-500'
                          }`} />
                          <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping ${
                            rider.status === 'active' ? 'bg-green-400' : 
                            rider.status === 'busy' ? 'bg-blue-400' : 'bg-gray-400'
                          }`} />
                          {selectedRider === rider.id && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {rider.name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
              {filteredRiders.map((rider) => (
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
                            <AvatarImage src={rider.avatar} />
                            <AvatarFallback>{rider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{rider.name}</p>
                            <p className="text-sm text-muted-foreground">{rider.id}</p>
                          </div>
                        </div>
                        {getStatusBadge(rider.status)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Navigation className="h-3 w-3" />
                            <span>Speed</span>
                          </div>
                          <span className="font-medium">{rider.speed}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Zap className={`h-3 w-3 ${getBatteryColor(rider.batteryLevel)}`} />
                            <span>Battery</span>
                          </div>
                          <span className={`font-medium ${getBatteryColor(rider.batteryLevel)}`}>
                            {rider.batteryLevel}%
                          </span>
                        </div>

                        {rider.currentOrder && (
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              <span>Current Order</span>
                            </div>
                            <span className="font-medium text-blue-600">{rider.currentOrder}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Last Update</span>
                          </div>
                          <span className="text-muted-foreground">{rider.lastUpdate}</span>
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
              ))}
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
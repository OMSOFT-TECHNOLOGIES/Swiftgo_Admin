import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  Search, 
  Bell,
  User,
  MapPin,
  Calendar,
  TrendingUp,
  Star,
  Plus,
  Eye,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface CustomerDashboardProps {
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

export function CustomerDashboard({ onNavigate, isDarkMode, toggleTheme, onLogout }: CustomerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - replace with real data from your API
  const recentOrders = [
    {
      id: 'GSG-001234',
      status: 'delivered',
      pickup: 'East Legon, Accra',
      delivery: 'Osu, Accra',
      date: '2026-01-02',
      amount: '₵25.00'
    },
    {
      id: 'GSG-001235',
      status: 'in_transit',
      pickup: 'Kumasi Central',
      delivery: 'KNUST Campus',
      date: '2026-01-02',
      amount: '₵18.50'
    },
    {
      id: 'GSG-001236',
      status: 'pending',
      pickup: 'Tamale Station',
      delivery: 'UDS Campus',
      date: '2026-01-02',
      amount: '₵30.00'
    }
  ];

  const quickStats = [
    {
      label: 'Total Orders',
      value: '247',
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      label: 'This Month',
      value: '8',
      change: '+25%',
      trend: 'up',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      label: 'Amount Spent',
      value: '₵2,450',
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      label: 'Avg Rating',
      value: '4.9',
      change: '+0.1',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600'
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'in_transit': return 'In Transit';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">GlobeSwiftGo</h1>
                <p className="text-xs text-muted-foreground">Customer Portal</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="text-blue-600">
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('my-orders')}>
                  My Orders
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('track-orders')}>
                  Track Orders
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('deliveries')}>
                  Deliveries
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('help-support')}>
                  Support
                </Button>
              </nav>
              
              {/* User Menu */}
              <div className="flex items-center space-x-2">
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
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="relative h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-sm bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                        U
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="end" sideOffset={8}>
                    <DropdownMenuLabel className="font-normal p-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">Customer Portal</p>
                        <p className="text-xs text-muted-foreground">customer@example.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onNavigate('my-orders')}
                      className="cursor-pointer p-3 focus:bg-accent"
                    >
                      <User className="mr-3 h-4 w-4" />
                      <div className="flex-1">
                        <span className="text-sm font-medium">My Profile</span>
                        <p className="text-xs text-muted-foreground">Manage account settings</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onNavigate('help-support')}
                      className="cursor-pointer p-3 focus:bg-accent"
                    >
                      <Bell className="mr-3 h-4 w-4" />
                      <div className="flex-1">
                        <span className="text-sm font-medium">Support</span>
                        <p className="text-xs text-muted-foreground">Get help and support</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={onLogout} 
                      className="cursor-pointer p-3 focus:bg-destructive/10 text-destructive hover:text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <div className="flex-1">
                        <span className="text-sm font-medium">Sign out</span>
                        <p className="text-xs opacity-75">End your current session</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Kwame! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your deliveries today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            size="lg" 
            className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => onNavigate('new-order')}
          >
            <Plus className="mr-2 h-6 w-6" />
            <div>
              <div className="font-semibold">New Delivery</div>
              <div className="text-xs opacity-90">Place a new order</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="h-20"
            onClick={() => onNavigate('track-orders')}
          >
            <Search className="mr-2 h-6 w-6" />
            <div>
              <div className="font-semibold">Track Order</div>
              <div className="text-xs text-muted-foreground">Find your delivery</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="h-20"
            onClick={() => onNavigate('help-support')}
          >
            <Phone className="mr-2 h-6 w-6" />
            <div>
              <div className="font-semibold">Get Help</div>
              <div className="text-xs text-muted-foreground">Contact support</div>
            </div>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-br from-current/10 to-current/20 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">{stat.change}</span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onNavigate('my-orders')}
                  >
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600/10 to-indigo-600/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.pickup} → {order.delivery}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(order.status)} mb-1`}>
                          {getStatusText(order.status)}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{order.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Profile */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Kwame Asante</p>
                    <p className="text-sm text-muted-foreground">Premium Customer</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>kwame@example.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>+233 24 123 4567</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>East Legon, Accra</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Search */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Track</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter order ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button className="w-full" onClick={() => onNavigate('track-orders')}>
                    <Eye className="mr-2 h-4 w-4" />
                    Track Order
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our customer support team is here to help you 24/7.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('help-support')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
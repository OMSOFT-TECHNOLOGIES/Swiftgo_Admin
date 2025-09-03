import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Package, Users, MapPin, Star, TrendingUp, DollarSign, Bell } from 'lucide-react';

const dailyOrdersData = [
  { name: 'Mon', orders: 45, revenue: 3250 },
  { name: 'Tue', orders: 52, revenue: 3640 },
  { name: 'Wed', orders: 48, revenue: 3432 },
  { name: 'Thu', orders: 61, revenue: 4368 },
  { name: 'Fri', orders: 55, revenue: 3927 },
  { name: 'Sat', orders: 67, revenue: 4914 },
  { name: 'Sun', orders: 43, revenue: 3068 },
];

const orderStatusData = [
  { name: 'Delivered', value: 156, color: '#22c55e' },
  { name: 'In Transit', value: 45, color: '#3b82f6' },
  { name: 'Pending', value: 23, color: '#f59e0b' },
  { name: 'Cancelled', value: 8, color: '#ef4444' },
];

export function Dashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-none">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground text-lg">Welcome to GlobeSwiftGo Ghana Admin Panel</p>
      </div>

      {/* Key Metrics */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900">1,232</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600 font-medium">
                  +12% from last month
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Riders</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900">45</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600 font-medium">
                  +3 new this week
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900">₵40,118</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600 font-medium">
                  +8% from last month
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900">4.8</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600 font-medium">
                  +0.2 from last month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Analytics Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Daily Orders & Revenue</CardTitle>
              <CardDescription className="text-base">Orders and revenue for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dailyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="orders" fill="#3b82f6" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Order Status Distribution</CardTitle>
              <CardDescription className="text-base">Current status of all orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Activity Feed</CardTitle>
            <CardDescription className="text-base">Latest updates from your delivery system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-green-50 border border-green-100">
                <div className="p-2 bg-green-500 rounded-full">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-green-900">Order #1234 delivered successfully</p>
                  <p className="text-sm text-green-700 mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-blue-900">New rider Kofi Mensah completed onboarding</p>
                  <p className="text-sm text-blue-700 mt-1">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-yellow-50 border border-yellow-100">
                <div className="p-2 bg-yellow-500 rounded-full">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-yellow-900">5 new customer registrations</p>
                  <p className="text-sm text-yellow-700 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-purple-50 border border-purple-100">
                <div className="p-2 bg-purple-500 rounded-full">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-purple-900">Promotional campaign sent to 1,250 users</p>
                  <p className="text-sm text-purple-700 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
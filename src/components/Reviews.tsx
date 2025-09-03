import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Search, Star, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Filter } from 'lucide-react';

const reviews = [
  {
    id: 'REV001',
    orderId: 'ORD-001',
    customer: 'Akosua Osei',
    rider: 'Kwame Asante',
    rating: 5,
    comment: 'Excellent service! Kwame was very professional and delivered my order quickly and safely from East Legon to Legon.',
    date: '2024-09-01 14:45',
    category: 'service',
    helpful: 12,
    reported: false,
    customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=40&h=40&fit=crop&crop=face',
    riderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'REV002',
    orderId: 'ORD-003',
    customer: 'Kofi Adjei',
    rider: 'Ama Serwaa',
    rating: 4,
    comment: 'Good delivery time from Kejetia to KNUST, but the rider could have been more careful with the package.',
    date: '2024-09-01 13:20',
    category: 'delivery',
    helpful: 8,
    reported: false,
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    riderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'REV003',
    orderId: 'ORD-007',
    customer: 'Efua Mensah',
    rider: 'Yaw Boateng',
    rating: 5,
    comment: 'Amazing service! Yaw went above and beyond to make sure my delivery from Tema to Airport Residential arrived on time.',
    date: '2024-08-31 16:30',
    category: 'service',
    helpful: 15,
    reported: false,
    customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    riderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'REV004',
    orderId: 'ORD-012',
    customer: 'Nana Adomako',
    rider: 'Kojo Mensah',
    rating: 2,
    comment: 'Package was damaged and the rider was late from Kantamanto to Dansoman. Not satisfied with the service.',
    date: '2024-08-31 11:15',
    category: 'quality',
    helpful: 3,
    reported: true,
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    riderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'REV005',
    orderId: 'ORD-015',
    customer: 'Abena Nyong',
    rider: 'Kwame Asante',
    rating: 5,
    comment: 'Perfect delivery! Kwame is always reliable and friendly. Highly recommend for deliveries in Accra!',
    date: '2024-08-30 19:45',
    category: 'service',
    helpful: 20,
    reported: false,
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
    riderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  }
];

const ratingDistribution = [
  { stars: 5, count: 156, percentage: 65 },
  { stars: 4, count: 48, percentage: 20 },
  { stars: 3, count: 24, percentage: 10 },
  { stars: 2, count: 8, percentage: 3 },
  { stars: 1, count: 4, percentage: 2 }
];

const renderStars = (rating: number) => {
  return [...Array(5)].map((_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${
        index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
      }`}
    />
  ));
};

const getRatingColor = (rating: number) => {
  if (rating >= 4) return 'text-green-600';
  if (rating >= 3) return 'text-yellow-600';
  return 'text-red-600';
};

export function Reviews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.rider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    const matchesCategory = categoryFilter === 'all' || review.category === categoryFilter;
    return matchesSearch && matchesRating && matchesCategory;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;
  const positivePercentage = Math.round((positiveReviews / totalReviews) * 100);

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-none">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Reviews & Ratings</h1>
        <p className="text-muted-foreground text-lg">Monitor customer feedback and service quality</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                  <div className="flex">{renderStars(Math.round(averageRating))}</div>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{totalReviews}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Positive Rate</p>
                <p className="text-2xl font-bold">{positivePercentage}%</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">+12%</p>
                <p className="text-xs text-green-600">↗ vs last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Distribution */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Rating Distribution</CardTitle>
            <CardDescription className="text-base">Breakdown of customer ratings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm">{item.stars}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                <Progress value={item.percentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Recent Reviews</CardTitle>
            <CardDescription className="text-base">Latest customer feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.customerAvatar} />
                            <AvatarFallback>{review.customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.customer}</p>
                            <p className="text-sm text-muted-foreground">Order {review.orderId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm">{review.comment}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={review.riderAvatar} />
                              <AvatarFallback>{review.rider.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">Rider: {review.rider}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {review.category}
                          </Badge>
                          {review.reported && (
                            <Badge variant="destructive" className="text-xs">
                              Reported
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {review.helpful}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="responses">Response Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Review Overview</CardTitle>
              <CardDescription>Summary of customer feedback and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Overview analytics and insights will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Rating Trends</CardTitle>
              <CardDescription>Track rating trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Rating trends and analytics will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>Response Management</CardTitle>
              <CardDescription>Manage responses to customer reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Review response management tools will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
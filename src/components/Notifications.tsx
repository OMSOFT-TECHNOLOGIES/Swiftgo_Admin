import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { Bell, Send, Users, MessageSquare, Megaphone, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const notifications = [
  {
    id: 'N001',
    title: 'Weekend Bonus Campaign',
    message: 'Earn 25% extra on all deliveries this weekend! Complete 10+ deliveries to qualify for bonus payments.',
    type: 'promotion',
    audience: 'riders',
    status: 'sent',
    recipients: 45,
    opens: 38,
    clicks: 12,
    sentAt: '2024-09-01 09:00',
    scheduled: false
  },
  {
    id: 'N002',
    title: 'New Delivery Zone Available',
    message: 'We\'ve expanded to the Eastside area! New opportunities await.',
    type: 'announcement',
    audience: 'riders',
    status: 'scheduled',
    recipients: 45,
    opens: 0,
    clicks: 0,
    sentAt: null,
    scheduled: true,
    scheduledFor: '2024-09-02 10:00'
  },
  {
    id: 'N003',
    title: 'App Update Available',
    message: 'Update to version 2.1.0 for better performance and new features.',
    type: 'system',
    audience: 'customers',
    status: 'sent',
    recipients: 1250,
    opens: 892,
    clicks: 234,
    sentAt: '2024-08-30 14:00',
    scheduled: false
  },
  {
    id: 'N004',
    title: 'Free Delivery Weekend - Accra Only',
    message: 'Enjoy free delivery on all orders this weekend in Greater Accra! Use code FREEACCRA.',
    type: 'promotion',
    audience: 'customers',
    status: 'draft',
    recipients: 0,
    opens: 0,
    clicks: 0,
    sentAt: null,
    scheduled: false
  }
];

const getStatusBadge = (status: string, scheduled: boolean) => {
  if (scheduled) return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
  
  switch (status) {
    case 'sent':
      return <Badge className="bg-green-100 text-green-800">Sent</Badge>;
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
    case 'failed':
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'promotion':
      return <Megaphone className="h-4 w-4 text-orange-500" />;
    case 'announcement':
      return <Bell className="h-4 w-4 text-blue-500" />;
    case 'system':
      return <AlertCircle className="h-4 w-4 text-purple-500" />;
    default:
      return <MessageSquare className="h-4 w-4 text-gray-500" />;
  }
};

export function Notifications() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'announcement',
    audience: 'riders',
    scheduled: false,
    scheduledDate: '',
    scheduledTime: '',
    pushNotification: true,
    emailNotification: false,
    smsNotification: false
  });

  const handleCreateNotification = () => {
    // In a real app, this would send the notification to the backend
    console.log('Creating notification:', newNotification);
    setIsCreateDialogOpen(false);
    setNewNotification({
      title: '',
      message: '',
      type: 'announcement',
      audience: 'riders',
      scheduled: false,
      scheduledDate: '',
      scheduledTime: '',
      pushNotification: true,
      emailNotification: false,
      smsNotification: false
    });
  };

  const sentNotifications = notifications.filter(n => n.status === 'sent');
  const draftNotifications = notifications.filter(n => n.status === 'draft');
  const scheduledNotifications = notifications.filter(n => n.scheduled);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 w-full max-w-none overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight break-words">Notifications & Announcements</h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg break-words">Send notifications and announcements to riders and customers</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4 w-[calc(100vw-1rem)] sm:w-auto">
            <DialogHeader>
              <DialogTitle>Create New Notification</DialogTitle>
              <DialogDescription>
                Send announcements and notifications to your riders and customers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    placeholder="Notification title"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newNotification.type} onValueChange={(value) => setNewNotification({...newNotification, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="system">System Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  placeholder="Enter your notification message..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="audience">Audience</Label>
                <Select value={newNotification.audience} onValueChange={(value) => setNewNotification({...newNotification, audience: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="riders">All Riders</SelectItem>
                    <SelectItem value="customers">All Customers</SelectItem>
                    <SelectItem value="both">Riders & Customers</SelectItem>
                    <SelectItem value="active-riders">Active Riders Only</SelectItem>
                    <SelectItem value="premium-customers">Premium Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Delivery Channels</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="push"
                      checked={newNotification.pushNotification}
                      onCheckedChange={(checked) => setNewNotification({...newNotification, pushNotification: !!checked})}
                    />
                    <Label htmlFor="push">Push Notification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email"
                      checked={newNotification.emailNotification}
                      onCheckedChange={(checked) => setNewNotification({...newNotification, emailNotification: !!checked})}
                    />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms"
                      checked={newNotification.smsNotification}
                      onCheckedChange={(checked) => setNewNotification({...newNotification, smsNotification: !!checked})}
                    />
                    <Label htmlFor="sms">SMS</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="scheduled"
                    checked={newNotification.scheduled}
                    onCheckedChange={(checked) => setNewNotification({...newNotification, scheduled: checked})}
                  />
                  <Label htmlFor="scheduled">Schedule for later</Label>
                </div>
                
                {newNotification.scheduled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newNotification.scheduledDate}
                        onChange={(e) => setNewNotification({...newNotification, scheduledDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newNotification.scheduledTime}
                        onChange={(e) => setNewNotification({...newNotification, scheduledTime: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button onClick={handleCreateNotification} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  {newNotification.scheduled ? 'Schedule Notification' : 'Send Now'}
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="sm:w-auto">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card className="shadow-sm">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Sent</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{sentNotifications.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-50 rounded-lg flex-shrink-0">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Scheduled</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{scheduledNotifications.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Drafts</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{draftNotifications.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-50 rounded-lg flex-shrink-0">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Open Rate</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">72%</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-50 rounded-lg flex-shrink-0">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
            <span className="hidden sm:inline">All Notifications</span>
            <span className="sm:hidden">All</span>
          </TabsTrigger>
          <TabsTrigger value="sent" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Sent</TabsTrigger>
          <TabsTrigger value="scheduled" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
            <span className="hidden sm:inline">Scheduled</span>
            <span className="sm:hidden">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 sm:space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold">All Notifications ({notifications.length})</CardTitle>
              <CardDescription className="text-xs sm:text-sm lg:text-base">Manage all your notifications and announcements</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                {notifications.map((notification) => (
                  <Card key={notification.id} className="overflow-hidden">
                    <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start space-x-2 sm:space-x-3 w-full">
                          <div className="mt-1 flex-shrink-0">
                            {getTypeIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="flex flex-col gap-2 mb-2">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <h3 className="font-semibold text-sm sm:text-base break-words">{notification.title}</h3>
                                {getStatusBadge(notification.status, notification.scheduled)}
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 break-words hyphens-auto">{notification.message}</p>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                              <span className="shrink-0">To: {notification.audience}</span>
                              <span className="shrink-0">Recipients: {notification.recipients}</span>
                              {notification.status === 'sent' && (
                                <>
                                  <span className="shrink-0">Opens: {notification.opens}</span>
                                  <span className="shrink-0">Clicks: {notification.clicks}</span>
                                </>
                              )}
                              {notification.sentAt && (
                                <span className="shrink-0 text-xs">Sent: {new Date(notification.sentAt).toLocaleString()}</span>
                              )}
                              {notification.scheduledFor && (
                                <span className="shrink-0 text-xs">Scheduled: {new Date(notification.scheduledFor).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">View</Button>
                          {notification.status === 'draft' && (
                            <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Send Now</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent">
          <Card>
            <CardHeader>
              <CardTitle>Sent Notifications</CardTitle>
              <CardDescription>Previously sent notifications and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Sent notifications will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Notifications</CardTitle>
              <CardDescription>Notifications scheduled for future delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Scheduled notifications will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Draft Notifications</CardTitle>
              <CardDescription>Unsent notification drafts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Draft notifications will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
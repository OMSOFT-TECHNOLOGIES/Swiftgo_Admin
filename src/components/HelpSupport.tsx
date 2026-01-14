import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  ArrowLeft,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Headphones,
  Send,
  Star,
  ThumbsUp,
  ExternalLink
} from 'lucide-react';

interface HelpSupportProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

export function HelpSupport({ onNavigate, onLogout, isDarkMode, toggleTheme }: HelpSupportProps) {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    subject: '',
    email: '',
    message: '',
    orderID: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Sample FAQ data
  const faqs = [
    {
      id: 1,
      category: 'Orders',
      question: 'How can I track my order?',
      answer: 'You can track your order by entering your order ID in the Track Orders page. You\'ll see real-time updates including pickup confirmation, rider assignment, current location, and estimated delivery time.',
      helpful: 15
    },
    {
      id: 2,
      category: 'Delivery',
      question: 'What are your delivery areas?',
      answer: 'We currently deliver across 25+ cities in Ghana including Accra, Kumasi, Tamale, Cape Coast, Takoradi, and more. We also offer rural delivery services for remote locations.',
      helpful: 23
    },
    {
      id: 3,
      category: 'Pricing',
      question: 'How is delivery cost calculated?',
      answer: 'Delivery cost is calculated based on distance, package size, delivery speed (express, standard), and destination zone. You\'ll see the exact cost before confirming your order.',
      helpful: 31
    },
    {
      id: 4,
      category: 'Orders',
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be cancelled or modified within 5 minutes of placement. Once a rider is assigned and pickup begins, cancellation may incur charges. Contact support for assistance.',
      helpful: 8
    },
    {
      id: 5,
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept Mobile Money (MTN, AirtelTigo, Vodafone), bank cards (Visa, Mastercard), and cash on delivery for verified customers.',
      helpful: 19
    },
    {
      id: 6,
      category: 'Delivery',
      question: 'What if no one is available to receive the package?',
      answer: 'Our riders will call you when they arrive. If no one is available, we can reschedule delivery or leave with a trusted neighbor with your permission.',
      helpful: 12
    }
  ];

  // Sample support tickets
  const recentTickets = [
    {
      id: 'SUP-001',
      subject: 'Delayed delivery for order GSG-001234',
      status: 'resolved',
      createdAt: '2026-01-01T10:30:00Z',
      lastUpdate: '2026-01-01T15:45:00Z'
    },
    {
      id: 'SUP-002',
      subject: 'Package damaged during delivery',
      status: 'in_progress',
      createdAt: '2025-12-30T14:20:00Z',
      lastUpdate: '2025-12-31T09:15:00Z'
    }
  ];

  const tabs = [
    { id: 'contact', label: 'Contact Us', icon: Phone },
    { id: 'faq', label: 'FAQ', icon: FileText },
    { id: 'tickets', label: 'My Tickets', icon: MessageCircle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Support request submitted:', formData);
    // Reset form
    setFormData({ subject: '', email: '', message: '', orderID: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <h1 className="text-xl font-semibold text-foreground">Help & Support</h1>
                <p className="text-sm text-muted-foreground">Get help with your deliveries and account</p>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-red-600 border-red-200">
                <Phone className="mr-1 h-3 w-3" />
                Emergency: +233 30 123 4567
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-4">Speak with our support team</p>
              <p className="font-medium text-blue-600">+233 30 123 4567</p>
              <p className="text-xs text-muted-foreground mt-1">24/7 Available</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">Instant support via WhatsApp</p>
              <p className="font-medium text-green-600">+233 24 567 8900</p>
              <p className="text-xs text-muted-foreground mt-1">Mon-Sun 6AM-11PM</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground mb-4">Send us your questions</p>
              <p className="font-medium text-purple-600">support@globeswiftgo.com</p>
              <p className="text-xs text-muted-foreground mt-1">Response within 2 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-border mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-b-none ${
                activeTab === tab.id ? 'border-b-2 border-blue-600' : ''
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'contact' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Order ID (Optional)</label>
                    <Input
                      placeholder="e.g., GSG-001234"
                      value={formData.orderID}
                      onChange={(e) => handleInputChange('orderID', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      placeholder="Please describe your issue in detail..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Support Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Support Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Phone Support</span>
                      <span className="font-medium">24/7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>WhatsApp Chat</span>
                      <span className="font-medium">6AM - 11PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Support</span>
                      <span className="font-medium">24/7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Average Response</span>
                      <span className="font-medium text-green-600">2 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('faq')}>
                      <Search className="mr-2 h-4 w-4" />
                      Track my order
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('faq')}>
                      <Clock className="mr-2 h-4 w-4" />
                      Delayed delivery
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('faq')}>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Damaged package
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('faq')}>
                      <Phone className="mr-2 h-4 w-4" />
                      Payment issues
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* FAQ Categories */}
            <div className="grid gap-6">
              {['Orders', 'Delivery', 'Payment', 'Pricing'].map((category) => {
                const categoryFAQs = filteredFAQs.filter(faq => faq.category === category);
                if (categoryFAQs.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">{category}</h3>
                    <div className="space-y-4">
                      {categoryFAQs.map((faq) => (
                        <Card key={faq.id}>
                          <CardContent className="p-6">
                            <h4 className="font-medium mb-3">{faq.question}</h4>
                            <p className="text-muted-foreground mb-4 leading-relaxed">{faq.answer}</p>
                            <div className="flex items-center justify-between">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="mr-1 h-3 w-3" />
                                Helpful ({faq.helpful})
                              </Button>
                              <Badge variant="outline">{faq.category}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Results */}
            {filteredFAQs.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or contact support directly.
                  </p>
                  <Button onClick={() => setActiveTab('contact')}>
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div>
            {/* Recent Tickets */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Your Support Tickets</h3>
              <Button onClick={() => setActiveTab('contact')}>
                <MessageCircle className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </div>

            {recentTickets.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No support tickets</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any support requests yet.
                  </p>
                  <Button onClick={() => setActiveTab('contact')}>
                    Create First Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <Card key={ticket.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{ticket.id}</h4>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status === 'resolved' && <CheckCircle className="mr-1 h-3 w-3" />}
                            {ticket.status === 'in_progress' && <Clock className="mr-1 h-3 w-3" />}
                            {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <h5 className="font-medium mb-2">{ticket.subject}</h5>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Created: {formatTimestamp(ticket.createdAt)}</span>
                        <span>Last Update: {formatTimestamp(ticket.lastUpdate)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
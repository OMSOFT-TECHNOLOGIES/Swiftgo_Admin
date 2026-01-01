import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { 
  Package, 
  Truck, 
  MapPin, 
  Users, 
  BarChart3, 
  Shield, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Zap,
  HeartHandshake,
  Sun,
  Moon,
  Menu,
  X,
  Phone,
  Mail,
  Download,
  Search,
  Smartphone,
  Play,
  Award,
  TrendingUp,
  UserPlus,
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin as Location,
  Clock3,
  Headphones
} from 'lucide-react';

interface HomepageProps {
  onSignIn: () => void;
  onPostOrder: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Homepage = ({ onSignIn, onPostOrder, isDarkMode, toggleTheme }: HomepageProps) => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const navigationItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'rider', label: 'Rider', href: '#rider' },
    { id: 'career', label: 'Career', href: '#career' },
    { id: 'track', label: 'Track Your Order', href: '#track' },
    { id: 'download', label: 'Download App', href: '#download' },
    { id: 'partnership', label: 'Partnership', href: '#partnership' }
  ];

  const services = [
    {
      icon: Package,
      title: "Express Delivery",
      description: "Fast and reliable delivery within 30 minutes in major cities",
      features: ["Same-day delivery", "Real-time tracking", "Insurance coverage"]
    },
    {
      icon: Truck,
      title: "Fleet Management",
      description: "Professional fleet management for businesses of all sizes",
      features: ["Vehicle tracking", "Route optimization", "Maintenance alerts"]
    },
    {
      icon: MapPin,
      title: "Nationwide Coverage",
      description: "Delivery services across all major cities in Ghana",
      features: ["25+ cities", "Rural delivery", "Cross-border options"]
    },
    {
      icon: Shield,
      title: "Secure Logistics",
      description: "End-to-end security with insurance and verification",
      features: ["Package security", "Identity verification", "Damage protection"]
    }
  ];

  const whyChooseUs = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Average delivery time of 25 minutes in urban areas",
      stat: "25 min"
    },
    {
      icon: Award,
      title: "99.8% Success Rate",
      description: "Industry-leading delivery success rate with minimal issues",
      stat: "99.8%"
    },
    {
      icon: Users,
      title: "50K+ Happy Customers",
      description: "Trusted by individuals and businesses across Ghana",
      stat: "50K+"
    },
    {
      icon: TrendingUp,
      title: "24/7 Support",
      description: "Round-the-clock customer support and tracking",
      stat: "24/7"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Place Your Order",
      description: "Simply place your delivery request through our app or admin panel",
      icon: Package
    },
    {
      step: 2,
      title: "Rider Assignment",
      description: "Our smart system assigns the nearest available rider to your order",
      icon: UserPlus
    },
    {
      step: 3,
      title: "Live Tracking",
      description: "Track your delivery in real-time with GPS and ETA updates",
      icon: MapPin
    },
    {
      step: 4,
      title: "Safe Delivery",
      description: "Receive your package safely with digital confirmation",
      icon: CheckCircle
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">GlobeSwiftGo</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Delivery Excellence</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    activeSection === item.id ? 'text-blue-600' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" onClick={onSignIn} className="hidden sm:flex">
                Sign In
              </Button>
              <Button onClick={onPostOrder} className="bg-primary hover:bg-primary/90">
                <Package className="mr-2 h-4 w-4" />
                Post Order
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-border bg-background">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors hover:text-blue-600 hover:bg-accent rounded-md ${
                      activeSection === item.id ? 'text-blue-600 bg-accent' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-2 border-t border-border mt-2">
                  <Button variant="outline" onClick={onSignIn} className="w-full mb-2">
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Video Background */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          {/* Dummy Video - replace with your actual promotional video */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea'/%3E%3Cstop offset='100%25' style='stop-color:%23764ba2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg)'/%3E%3C/svg%3E"
          >
            {/* Using Big Buck Bunny as dummy video - you can replace with your own */}
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
              <Play className="h-20 w-20 text-white/30" />
            </div>
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-white/10 text-white border-white/20">
            <Zap className="w-4 h-4 mr-2" />
            #1 Delivery Platform in Ghana
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Delivering
            <span className="text-blue-400 block sm:inline sm:ml-4">Excellence</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Fast, reliable, and secure delivery services across Ghana. 
            Join thousands of satisfied customers and experience delivery redefined.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={onPostOrder}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Package className="mr-2 h-6 w-6" />
              Start Delivery Now
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => scrollToSection('track')}
              className="px-8 py-4 text-lg font-semibold border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300"
            >
              <Search className="mr-2 h-6 w-6" />
              Track Order
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">15K+</div>
              <div className="text-sm text-white/80">Daily Deliveries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-sm text-white/80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">25+</div>
              <div className="text-sm text-white/80">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">25min</div>
              <div className="text-sm text-white/80">Avg Delivery Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">About GlobeSwiftGo</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Ghana's Leading Delivery Service Provider
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Founded in 2020, GlobeSwiftGo has revolutionized the delivery landscape in Ghana. 
                We've grown from a small startup to the most trusted delivery platform, serving over 
                50,000 customers across 25+ cities.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our mission is to connect communities through reliable, fast, and affordable delivery 
                services while creating opportunities for local entrepreneurs and riders.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">2020</div>
                  <div className="text-sm text-muted-foreground">Founded</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
                  <div className="text-sm text-muted-foreground">Deliveries Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Active Riders</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">99.8%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl flex items-center justify-center">
                <Globe className="h-32 w-32 text-blue-600/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Our Services</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Comprehensive Delivery Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From express deliveries to fleet management, we provide end-to-end solutions 
              for all your logistics needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const serviceImages = [
                'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=250&fit=crop&crop=center', // Express Delivery
                'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop&crop=center', // Fleet Management
                'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=400&h=250&fit=crop&crop=center', // Nationwide Coverage
                'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&crop=center'  // Secure Logistics
              ];
              
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border overflow-hidden">
                  {/* Service Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={serviceImages[index]} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback */}
                    <div className="hidden w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <service.icon className="h-16 w-16 text-white" />
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    {/* Service icon overlay */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center shadow-lg">
                      <service.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why GlobeSwiftGo Section */}
      <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-primary/5 to-accent/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Why GlobeSwiftGo Stands Out
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our industry-leading performance, 
              reliability, and customer satisfaction.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((reason, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-br group-hover:from-blue-600/20 group-hover:to-indigo-600/20 transition-colors">
                    <reason.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{reason.stat}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Simple Steps to Fast Delivery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting your items delivered is as easy as 1-2-3-4. Here's how our seamless process works.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const stepImages = [
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&crop=center', // Order placement
                'https://images.unsplash.com/photo-1558618666-fbd00c0cd61c?w=300&h=200&fit=crop&crop=center', // Rider assignment 
                'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop&crop=center', // Live tracking
                'https://images.unsplash.com/photo-1565807904742-d3466026aff0?w=300&h=200&fit=crop&crop=center'  // Safe delivery
              ];
              
              return (
                <div key={index} className="text-center relative">
                  {/* Connection line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-border transform -translate-x-1/2 z-0"></div>
                  )}
                  
                  {/* Step number badge */}
                  <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-lg font-bold text-white">{step.step}</span>
                  </div>
                  
                  {/* Step image */}
                  <div className="relative mb-6">
                    <img 
                      src={stepImages[index]} 
                      alt={step.title}
                      className="w-full h-48 object-cover rounded-xl shadow-lg transition-transform hover:scale-105 duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback icon */}
                    <div className="hidden w-full h-48 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-xl flex items-center justify-center">
                      <step.icon className="h-16 w-16 text-blue-600" />
                    </div>
                    {/* Overlay with step icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center shadow-md">
                      <step.icon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rider Section */}
      <section id="rider" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Join Our Team</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Become a GlobeSwiftGo Rider
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Join our growing network of professional riders and earn competitive income 
                while serving your community. Flexible schedules, fair compensation, and full support.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Earn ₵50-100 per day</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Flexible working hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Weekly payments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Full insurance coverage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Training and support</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Apply as Rider
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Download Rider App
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Active Riders</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">₵2.5k</div>
                <div className="text-sm text-muted-foreground">Avg Monthly Earnings</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">4.9★</div>
                <div className="text-sm text-muted-foreground">Rider Rating</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section id="career" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Careers</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Build Your Career with Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join a fast-growing company that's revolutionizing logistics in Ghana. 
              We're always looking for talented individuals to join our team.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Customer Service</h3>
              <p className="text-sm text-muted-foreground mb-4">Help customers with their delivery needs</p>
              <Badge variant="secondary">3 openings</Badge>
            </Card>
            <Card className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Operations</h3>
              <p className="text-sm text-muted-foreground mb-4">Optimize delivery routes and operations</p>
              <Badge variant="secondary">2 openings</Badge>
            </Card>
            <Card className="p-6 text-center">
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Technology</h3>
              <p className="text-sm text-muted-foreground mb-4">Build the future of delivery technology</p>
              <Badge variant="secondary">5 openings</Badge>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <UserPlus className="mr-2 h-5 w-5" />
              View All Positions
            </Button>
          </div>
        </div>
      </section>

      {/* Track Your Order Section */}
      <section id="track" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-primary/5 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">Order Tracking</Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Track Your Order
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Enter your tracking number to get real-time updates on your delivery status.
          </p>
          
          <Card className="p-8">
            <form className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input 
                  placeholder="Enter tracking number (e.g. GSG123456789)"
                  className="flex-1 h-12 text-lg"
                />
                <Button size="lg" className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Track Now
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Don't have a tracking number? <button className="text-primary hover:underline">Sign in to view your orders</button>
              </p>
            </form>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Order Placed</h3>
              <p className="text-sm text-muted-foreground">Your order is confirmed and being prepared</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Out for Delivery</h3>
              <p className="text-sm text-muted-foreground">Your order is on the way to you</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Delivered</h3>
              <p className="text-sm text-muted-foreground">Package successfully delivered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section id="download" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Mobile App</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Download the GlobeSwiftGo App
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Get the full GlobeSwiftGo experience on your mobile device. 
                Place orders, track deliveries, and manage your account on the go.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Easy order placement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Real-time tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Secure payments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Order history</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-black text-white hover:bg-black/90">
                  <Download className="mr-2 h-5 w-5" />
                  App Store
                </Button>
                <Button size="lg" variant="outline">
                  <Download className="mr-2 h-5 w-5" />
                  Google Play
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=600&fit=crop&crop=center"
                alt="Mobile app interface showing delivery tracking"
                className="w-full max-w-sm mx-auto h-96 object-cover rounded-3xl shadow-2xl border-8 border-white/10"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.classList.remove('hidden');
                }}
              />
              {/* Fallback */}
              <div className="hidden aspect-square bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl flex items-center justify-center">
                <Smartphone className="h-32 w-32 text-blue-600/50" />
              </div>
              
              {/* Floating app features */}
              <div className="absolute -top-4 -left-4 bg-card border border-border rounded-lg p-3 shadow-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Live GPS</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-lg p-3 shadow-xl">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">4.9★</div>
                  <div className="text-xs text-muted-foreground">App Rating</div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-6 bg-card border border-border rounded-lg p-3 shadow-xl">
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground">50K+</div>
                  <div className="text-xs text-muted-foreground">Downloads</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section id="join-us" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <HeartHandshake className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Join the GlobeSwiftGo Family?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a customer, rider, or business partner, we're here to serve you. 
            Join thousands who trust GlobeSwiftGo for their delivery needs.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">For Customers</h3>
              <p className="text-sm text-muted-foreground mb-4">Fast, reliable delivery at your fingertips</p>
              <Button onClick={onPostOrder} className="w-full">Get Started</Button>
            </Card>
            <Card className="p-6 text-center">
              <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">For Riders</h3>
              <p className="text-sm text-muted-foreground mb-4">Earn money with flexible schedules</p>
              <Button variant="outline" className="w-full">Become a Rider</Button>
            </Card>
            <Card className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">For Businesses</h3>
              <p className="text-sm text-muted-foreground mb-4">Scale your delivery operations</p>
              <Button onClick={onSignIn} variant="outline" className="w-full">Admin Access</Button>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={onPostOrder}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Package className="mr-2 h-5 w-5" />
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 text-lg font-semibold border-2 hover:bg-accent transition-all duration-300"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="partnership" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Partnership Program</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Become a GlobeSwiftGo Partner
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our growing network of partners and expand your business with our delivery solutions. 
              Whether you're a restaurant, retailer, or service provider, we have partnership opportunities for you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left side - Partnership Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=400&fit=crop&crop=center"
                alt="Business partnership handshake"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.classList.remove('hidden');
                }}
              />
              {/* Fallback */}
              <div className="hidden w-full h-96 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                <HeartHandshake className="h-24 w-24 text-white" />
              </div>
              
              {/* Floating partner count */}
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-lg p-4 shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">200+</div>
                  <div className="text-xs text-muted-foreground">Active Partners</div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-card border border-border rounded-lg p-4 shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">₵2M+</div>
                  <div className="text-xs text-muted-foreground">Partner Revenue</div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Why Partner with Us?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Increase Revenue</h4>
                    <p className="text-muted-foreground">Expand your customer reach and increase sales through our delivery network</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Access New Customers</h4>
                    <p className="text-muted-foreground">Connect with thousands of customers actively looking for your services</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Reliable Support</h4>
                    <p className="text-muted-foreground">24/7 technical support and dedicated account management</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Analytics & Insights</h4>
                    <p className="text-muted-foreground">Detailed performance analytics to optimize your operations</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1,000+</div>
                <div className="text-sm text-muted-foreground">Active Partners</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">₵5M+</div>
                <div className="text-sm text-muted-foreground">Monthly Partner Revenue</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15%</div>
                <div className="text-sm text-muted-foreground">Avg Revenue Increase</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">48hrs</div>
                <div className="text-sm text-muted-foreground">Setup Time</div>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-colors">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Restaurant Partners</h3>
              <p className="text-sm text-muted-foreground mb-4">Food delivery with seamless ordering and kitchen integration</p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                <li>• Commission-based pricing</li>
                <li>• Menu management tools</li>
                <li>• Order tracking system</li>
              </ul>
              <Button variant="outline" size="sm" className="w-full">Learn More</Button>
            </Card>
            
            <Card className="p-6 text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:from-green-500/20 group-hover:to-green-600/20 transition-colors">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Retail Partners</h3>
              <p className="text-sm text-muted-foreground mb-4">E-commerce and retail delivery solutions</p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                <li>• Inventory sync</li>
                <li>• Multi-location support</li>
                <li>• Customer notifications</li>
              </ul>
              <Button variant="outline" size="sm" className="w-full">Learn More</Button>
            </Card>
            
            <Card className="p-6 text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:from-purple-500/20 group-hover:to-purple-600/20 transition-colors">
                <HeartHandshake className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Service Partners</h3>
              <p className="text-sm text-muted-foreground mb-4">On-demand services and appointment delivery</p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                <li>• Service scheduling</li>
                <li>• Professional verification</li>
                <li>• Payment processing</li>
              </ul>
              <Button variant="outline" size="sm" className="w-full">Learn More</Button>
            </Card>
          </div>

          <div className="text-center">
            <Card className="p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-foreground mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join our partner program today and start growing your business with GlobeSwiftGo. 
                Our team will help you get set up in just 48 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Apply for Partnership
                </Button>
                <Button variant="outline" size="lg" onClick={() => scrollToSection('contact')}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Schedule a Call
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Contact Us</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or need support? We're here to help. 
              Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                      <p className="text-muted-foreground">+233 24 123 4567</p>
                      <p className="text-muted-foreground">+233 20 987 6543</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <p className="text-muted-foreground">support@globeswiftgo.com</p>
                      <p className="text-muted-foreground">hello@globeswiftgo.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Location className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Address</h4>
                      <p className="text-muted-foreground">123 Independence Avenue</p>
                      <p className="text-muted-foreground">Accra, Ghana</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Hours</h4>
                      <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 8:00 PM</p>
                      <p className="text-muted-foreground">Saturday - Sunday: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Send us a Message</h3>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <Input 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <Textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-foreground">GlobeSwiftGo</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Ghana's leading delivery service provider, connecting communities through 
                fast, reliable, and affordable logistics solutions.
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Facebook className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Twitter className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Instagram className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Linkedin className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Express Delivery</li>
                <li>Same Day Delivery</li>
                <li>Fleet Management</li>
                <li>Business Solutions</li>
                <li>International Shipping</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Headphones className="h-4 w-4" />
                  <span>24/7 Customer Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@globeswiftgo.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+233 24 123 4567</span>
                </li>
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2025 GlobeSwiftGo. All rights reserved. Delivering excellence across Ghana.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
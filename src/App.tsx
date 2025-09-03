import { useState, useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { Toaster } from "./components/ui/sonner";
// Fallback logo using data URI - replace with your actual logo
const globeSwiftGoLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzMxNzhGRiIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTYgMTJIMjBWMjhIMTZWMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Orders } from "./components/Orders";
import { Riders } from "./components/Riders";
import { LiveMap } from "./components/LiveMap";
import { ParcelTracking } from "./components/ParcelTracking";
import { CustomerManagement } from "./components/CustomerManagement";
import { Analytics } from "./components/Analytics";
import { Reports } from "./components/Reports";
import { Notifications } from "./components/Notifications";
import { Reviews } from "./components/Reviews";
import { 
  Home, 
  Package, 
  Users, 
  MapPin, 
  Bell, 
  Star, 
  BarChart3, 
  FileText, 
  UserCheck, 
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  User,
  Shield,
  HelpCircle,
  Activity,
  ToggleLeft,
  Sun,
  Moon
} from 'lucide-react';
// Remove unused example image import

const menuSections = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    ]
  },
  {
    title: 'Operations',
    items: [
      { id: 'orders', label: 'Orders', icon: Package, badge: { count: 12, variant: 'blue' } },
      { id: 'riders', label: 'Riders', icon: Users, badge: null },
      { id: 'live-map', label: 'Live Map', icon: MapPin, badge: { count: 'LIVE', variant: 'green' } },
      { id: 'parcel-tracking', label: 'Parcel Tracking', icon: Package, badge: null },
    ]
  },
  {
    title: 'Management',
    items: [
      { id: 'customers', label: 'Customers', icon: UserCheck, badge: null },
      { id: 'reviews', label: 'Reviews', icon: Star, badge: null },
      { id: 'notifications', label: 'Notifications', icon: Bell, badge: { count: 3, variant: 'red' } },
    ]
  },
  {
    title: 'Analytics',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
      { id: 'reports', label: 'Reports', icon: FileText, badge: null },
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDarkMode(shouldUseDark);
    
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Check for existing authentication on app load
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    const savedUser = localStorage.getItem('user');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Handle login
  const handleLogin = (credentials: { email: string; password: string; rememberMe: boolean }) => {
    // Extract name from email for demo purposes
    const name = credentials.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const userData = { email: credentials.email, name };
    
    setIsAuthenticated(true);
    setUser(userData);
    
    // Save authentication state
    if (credentials.rememberMe) {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('auth', 'true');
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('user');
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    };
    const dateStr = now.toLocaleDateString('en-US', options);
    return `${dateStr} • Accra Time`;
  };

  const getActiveTabName = () => {
    const currentSection = menuSections.find(section => 
      section.items.some(item => item.id === activeTab)
    );
    const currentItem = currentSection?.items.find(item => item.id === activeTab);
    return currentItem?.label || 'Overview';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <Orders />;
      case 'riders':
        return <Riders />;
      case 'live-map':
        return <LiveMap />;
      case 'parcel-tracking':
        return <ParcelTracking />;
      case 'customers':
        return <CustomerManagement />;
      case 'reviews':
        return <Reviews />;
      case 'notifications':
        return <Notifications />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background">
          {/* Sidebar - simplified without the complex positioning */}
          <div className={`hidden md:flex flex-col border-r border-border bg-sidebar flex-shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
            <SidebarHeader className={`border-b border-sidebar-border bg-sidebar ${sidebarCollapsed ? 'p-3' : 'p-6'}`}>
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-md ring-1 ring-border">
                  <img 
                    src={globeSwiftGoLogo} 
                    alt="GlobeSwiftGo Logo" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg text-sidebar-foreground tracking-tight">GlobeSwiftGo</h2>
                      <p className="text-sm text-sidebar-accent-foreground font-medium">Admin Dashboard</p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/80 shadow-sm">
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                  </>
                )}
              </div>
            </SidebarHeader>
            
            <SidebarContent className={`bg-sidebar flex-1 ${sidebarCollapsed ? 'px-2 py-4' : 'px-3 py-4'}`}>
              <div className="space-y-6">
                {menuSections.map((section, sectionIndex) => (
                  <div key={section.title} className="space-y-2">
                    {!sidebarCollapsed && (
                      <div className="px-3 py-1">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {section.title}
                        </h3>
                      </div>
                    )}
                    <SidebarMenu className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        
                        const getBadgeVariant = (variant: string, count: any) => {
                          if (sidebarCollapsed) return null; // Hide badges when collapsed
                          if (variant === 'red') {
                            return <Badge className="ml-auto bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-medium">{count}</Badge>;
                          } else if (variant === 'blue') {
                            return <Badge className="ml-auto bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-medium">{count}</Badge>;
                          } else if (variant === 'green') {
                            return <Badge className="ml-auto bg-green-500 hover:bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full shadow-sm font-medium animate-pulse">{count}</Badge>;
                          }
                          return null;
                        };

                        return (
                          <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                              isActive={isActive}
                              onClick={() => setActiveTab(item.id)}
                              className={`
                                group w-full justify-start rounded-xl text-sm font-medium transition-all duration-200 
                                ${sidebarCollapsed ? 'p-3' : 'px-3 py-3'}
                                ${isActive 
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-sidebar-primary text-white dark:text-sidebar-primary-foreground shadow-lg shadow-blue-500/25 dark:shadow-lg border-0' 
                                  : 'hover:bg-sidebar-accent hover:shadow-md text-sidebar-foreground'
                                }
                              `}
                              title={sidebarCollapsed ? item.label : undefined}
                            >
                              <Icon className={`h-4 w-4 transition-colors ${sidebarCollapsed ? 'mx-auto' : ''} ${isActive ? 'text-white dark:text-sidebar-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground'}`} />
                              {!sidebarCollapsed && (
                                <>
                                  <span className={`transition-colors ${isActive ? 'text-white dark:text-sidebar-primary-foreground' : 'text-sidebar-foreground'}`}>
                                    {item.label}
                                  </span>
                                  {item.badge && getBadgeVariant(item.badge.variant, item.badge.count)}
                                </>
                              )}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </div>
                ))}
              </div>
            </SidebarContent>

            {/* User Profile Section */}
            <div className="border-t border-sidebar-border p-4 mt-auto bg-sidebar">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full p-2 h-auto hover:bg-sidebar-accent hover:shadow-md transition-all duration-200 rounded-xl">
                    <div className={`flex items-center w-full ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
                      <Avatar className="h-10 w-10 border-2 border-background shadow-md ring-2 ring-border">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">KA</AvatarFallback>
                      </Avatar>
                      {!sidebarCollapsed && (
                        <>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-semibold truncate text-sidebar-foreground">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@globeswiftgo.com.gh'}</p>
                          </div>
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                        </>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 shadow-xl border-0 bg-popover z-[100]" sideOffset={8}>
                  <DropdownMenuLabel className="font-semibold text-popover-foreground">
                    <div className="flex items-center space-x-3 py-2">
                      <Avatar className="h-12 w-12 border-2 border-border">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">KA</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-muted-foreground truncate">Administrator</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@globeswiftgo.com.gh'}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                    <User className="mr-3 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Profile Settings</span>
                      <p className="text-xs text-muted-foreground">Manage your personal information</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                    <Shield className="mr-3 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Security & Privacy</span>
                      <p className="text-xs text-muted-foreground">Password and account security</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                    <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Dashboard Preferences</span>
                      <p className="text-xs text-muted-foreground">Customize your workspace</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                    <Bell className="mr-3 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Notification Settings</span>
                      <p className="text-xs text-muted-foreground">Email and push notifications</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                    <HelpCircle className="mr-3 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Help & Support</span>
                      <p className="text-xs text-muted-foreground">Documentation and contact</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                    <Activity className="mr-3 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Activity Log</span>
                      <p className="text-xs text-muted-foreground">Recent admin activities</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors p-3"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Sign Out</span>
                      <p className="text-xs opacity-75">End your current session</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <Sidebar className="md:hidden" variant="sidebar" collapsible="offcanvas">
            <SidebarHeader className="border-b border-sidebar-border p-6 bg-sidebar">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-md ring-1 ring-border">
                  <img 
                    src={globeSwiftGoLogo} 
                    alt="GlobeSwiftGo Logo" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-sidebar-foreground tracking-tight">GlobeSwiftGo</h2>
                  <p className="text-sm text-sidebar-accent-foreground font-medium">Admin Dashboard</p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/80 shadow-sm">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="px-3 py-4 bg-sidebar">
              <div className="space-y-6">
                {menuSections.map((section, sectionIndex) => (
                  <div key={section.title} className="space-y-2">
                    <div className="px-3 py-1">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {section.title}
                      </h3>
                    </div>
                    <SidebarMenu className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        
                        const getBadgeVariant = (variant: string, count: any) => {
                          if (variant === 'red') {
                            return <Badge className="ml-auto bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-medium">{count}</Badge>;
                          } else if (variant === 'blue') {
                            return <Badge className="ml-auto bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-medium">{count}</Badge>;
                          } else if (variant === 'green') {
                            return <Badge className="ml-auto bg-green-500 hover:bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full shadow-sm font-medium animate-pulse">{count}</Badge>;
                          }
                          return null;
                        };

                        return (
                          <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                              isActive={isActive}
                              onClick={() => setActiveTab(item.id)}
                              className={`
                                group w-full justify-start rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 
                                ${isActive 
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-sidebar-primary text-white dark:text-sidebar-primary-foreground shadow-lg shadow-blue-500/25 dark:shadow-lg border-0' 
                                  : 'hover:bg-sidebar-accent hover:shadow-md text-sidebar-foreground'
                                }
                              `}
                            >
                              <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-white dark:text-sidebar-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground'}`} />
                              <span className={`transition-colors ${isActive ? 'text-white dark:text-sidebar-primary-foreground' : 'text-sidebar-foreground'}`}>
                                {item.label}
                              </span>
                              {item.badge && getBadgeVariant(item.badge.variant, item.badge.count)}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </div>
                ))}
              </div>
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            {/* Top Bar */}
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 shadow-sm sticky top-0 z-40">
              <div className="flex h-16 items-center justify-between px-6 lg:px-8 w-full">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="md:hidden">
                    <Button variant="ghost" size="sm" className="hover:bg-accent rounded-lg transition-colors p-2">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SidebarTrigger>

                  {/* Desktop sidebar toggle */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleSidebar}
                    className="hidden md:flex hover:bg-accent rounded-lg transition-colors p-2"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{getActiveTabName()}</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">System Online</span>
                    </div>
                  </div>
                </div>

                {/* Center Section - Date/Time */}
                <div className="hidden md:flex items-center">
                  <span className="text-sm text-muted-foreground font-medium">{getCurrentDateTime()}</span>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-3">
                  {/* Notification Bell */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative">
                        <Button variant="ghost" size="sm" className="hover:bg-accent rounded-lg transition-colors p-2">
                          <Bell className="h-4 w-4" />
                        </Button>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">3</span>
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 shadow-xl border-0 bg-popover z-[100]" sideOffset={8}>
                      <DropdownMenuLabel className="font-semibold text-popover-foreground border-b border-border pb-2">
                        <div className="flex items-center justify-between">
                          <span>Notifications</span>
                          <Badge className="bg-red-500 text-white text-xs">3 New</Badge>
                        </div>
                      </DropdownMenuLabel>
                      <div className="max-h-96 overflow-y-auto">
                        <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3 flex-col items-start">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">New Order Received</p>
                              <p className="text-xs text-muted-foreground mt-1">Order #GS2024001 from Kwame Nkrumah Circle to Labadi Beach</p>
                              <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3 flex-col items-start">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">Rider Available</p>
                              <p className="text-xs text-muted-foreground mt-1">Joseph Mensah is now online and ready for deliveries</p>
                              <p className="text-xs text-muted-foreground mt-1">5 minutes ago</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3 flex-col items-start">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">Delivery Completed</p>
                              <p className="text-xs text-muted-foreground mt-1">Order #GS2024000 successfully delivered to East Legon</p>
                              <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-center justify-center text-primary hover:bg-accent transition-colors">
                        <span className="text-sm font-medium">View All Notifications</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Theme Toggle */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleTheme}
                    className="hover:bg-accent rounded-lg transition-colors p-2"
                    title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {isDarkMode ? (
                      <Sun className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Moon className="h-4 w-4 text-gray-700" />
                    )}
                  </Button>

                  {/* User Avatar */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative cursor-pointer">
                        <Button variant="ghost" className="h-auto p-1 hover:bg-accent rounded-lg transition-colors">
                          <Avatar className="h-8 w-8 border-2 border-border shadow-sm">
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold text-sm">KA</AvatarFallback>
                          </Avatar>
                        </Button>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 shadow-xl border-0 bg-popover z-[100]" sideOffset={8}>
                      <DropdownMenuLabel className="font-semibold text-popover-foreground">
                        <div className="flex items-center space-x-3 py-2">
                          <Avatar className="h-12 w-12 border-2 border-border">
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">KA</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-muted-foreground truncate">Administrator</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@globeswiftgo.com.gh'}</p>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                        <User className="mr-3 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">Profile Settings</span>
                          <p className="text-xs text-muted-foreground">Manage your personal information</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                        <Shield className="mr-3 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">Security & Privacy</span>
                          <p className="text-xs text-muted-foreground">Password and account security</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                        <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">Dashboard Preferences</span>
                          <p className="text-xs text-muted-foreground">Customize your workspace</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                        <Bell className="mr-3 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">Notification Settings</span>
                          <p className="text-xs text-muted-foreground">Email and push notifications</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                        <HelpCircle className="mr-3 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">Help & Support</span>
                          <p className="text-xs text-muted-foreground">Documentation and contact</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors p-3">
                        <Activity className="mr-3 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">Activity Log</span>
                          <p className="text-xs text-muted-foreground">Recent admin activities</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors p-3"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">Sign Out</span>
                          <p className="text-xs opacity-75">End your current session</p>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-accent/30 w-full">
              <div className="w-full max-w-none">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  );
}
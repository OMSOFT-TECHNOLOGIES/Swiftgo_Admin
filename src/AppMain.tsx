import { useState, useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from './hooks/useAuth';
import { authService } from './services/auth';
// Fallback logo using data URI - replace with your actual logo
const globeSwiftGoLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzMxNzhGRiIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTYgMTJIMjBWMjhIMTZWMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
import { Login } from "./components/Login";
import { ResetPassword } from "./components/ResetPassword";
import { Homepage } from "./components/Homepage";
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
// Customer Dashboard Components
import { CustomerDashboard } from "./components/CustomerDashboard";
import { MyOrders } from "./components/MyOrders";
import { TrackOrders } from "./components/TrackOrders";
import { Deliveries } from "./components/Deliveries";
import { HelpSupport } from "./components/HelpSupport";
import { CreateOrder } from "./components/CreateOrder";
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

export default function AppMain() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // New state for showing login
  const [currentCustomerPage, setCurrentCustomerPage] = useState('dashboard'); // Customer page state
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    admin: any | null;
    loading: boolean;
  }>({
    isAuthenticated: false,
    admin: null,
    loading: true
  });
  
  // Function to read auth state from localStorage
  const readAuthFromStorage = () => {
    const token = localStorage.getItem('swiftgo_admin_token') || sessionStorage.getItem('swiftgo_admin_token');
    const userStr = localStorage.getItem('swiftgo_admin_user') || sessionStorage.getItem('swiftgo_admin_user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        return {
          isAuthenticated: true,
          admin: userData,
          loading: false
        };
      } catch (error) {
        console.error('Failed to parse user data from storage:', error);
      }
    }
    
    return {
      isAuthenticated: false,
      admin: null,
      loading: false
    };
  };

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      // First check if this is a Google OAuth callback
      if (authService.isGoogleAuthCallback()) {
        console.log('App: Detected Google OAuth callback');
        try {
          const response = await authService.handleGoogleAuthCallback();
          if (response) {
            console.log('App: Google OAuth callback successful', response);
            const userData = response.admin || (response as any).user;
            
            // Determine if user should be treated as admin or customer
            const isAdmin = userData.type === 'admin' || userData.email?.toLowerCase().includes('admin');
            console.log('App: User type determined:', isAdmin ? 'admin' : 'customer', userData);
            
            setAuthState({
              isAuthenticated: true,
              admin: userData,
              loading: false
            });
            
            // Set appropriate active tab based on user type
            if (isAdmin) {
              setActiveTab('dashboard'); // Admin dashboard
              setCurrentCustomerPage('dashboard'); // Reset customer page
            } else {
              setCurrentCustomerPage('dashboard'); // Customer dashboard
            }
            
            return;
          }
        } catch (error) {
          console.error('App: Google OAuth callback failed:', error);
          setAuthState({
            isAuthenticated: false,
            admin: null,
            loading: false
          });
        }
      }
      
      // Fallback to regular storage-based auth
      const initialAuthState = readAuthFromStorage();
      console.log('App: Initial auth state from storage:', initialAuthState);
      setAuthState(initialAuthState);
    };
    
    initializeAuth();
  }, []);

  // Listen for storage changes (for logout and cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'swiftgo_admin_token' || e.key === 'swiftgo_admin_user') {
        console.log('App: Storage changed, updating auth state');
        const newAuthState = readAuthFromStorage();
        setAuthState(newAuthState);
      }
    };

    // Listen for custom auth events (for same-tab changes)
    const handleAuthChange = () => {
      console.log('App: Auth event received, updating auth state');
      const newAuthState = readAuthFromStorage();
      setAuthState(newAuthState);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const { logout } = useAuth(); // Only need logout function
  
  // Debug logging for authentication state
  console.log('App component state:', { 
    isAuthenticated: authState.isAuthenticated, 
    loading: authState.loading,
    admin: authState.admin ? { email: authState.admin.email, type: authState.admin.type } : null
  });

  // Handle automatic redirection after successful login
  useEffect(() => {
    console.log('App: useEffect triggered with auth state:', { 
      isAuthenticated: authState.isAuthenticated, 
      admin: authState.admin?.email, 
      loading: authState.loading 
    });
    if (authState.isAuthenticated && authState.admin && !authState.loading) {
      console.log('User authenticated successfully, preparing redirect...');
      // Reset to show login false since user is now authenticated
      if (showLogin) {
        console.log('App: Hiding login page');
        setShowLogin(false);
      }
      
      // Ensure customer page is reset to dashboard for new logins
      if (!authState.admin.email?.toLowerCase().includes('admin')) {
        console.log('Regular user detected, redirecting to customer dashboard');
        setCurrentCustomerPage('dashboard');
      } else {
        console.log('Admin user detected, redirecting to admin dashboard');
        setActiveTab('dashboard');
      }
    }
  }, [authState.isAuthenticated, authState.admin, authState.loading, showLogin]);

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

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Customer navigation handler
  const handleCustomerNavigation = (page: string) => {
    setCurrentCustomerPage(page);
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

  // Show loading state while authentication is being determined
  if (authState.loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show homepage or login page if not authenticated
  if (!authState.isAuthenticated) {
    console.log('User not authenticated, showing', showLogin ? 'login' : 'homepage');
    
    if (showLogin) {
      return (
        <Login 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme}
          onBack={() => setShowLogin(false)}
        />
      );
    } else {
      return (
        <Homepage 
          onSignIn={() => setShowLogin(true)}
          onPostOrder={() => setShowLogin(true)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      );
    }
  }

  // Check if user is admin or regular customer
  const isAdminUser = authState.admin?.type === 'admin' || authState.admin?.email?.toLowerCase().includes('admin') || false;
  console.log('User type detection:', { 
    email: authState.admin?.email, 
    type: authState.admin?.type,
    isAdminUser, 
    currentCustomerPage,
    fullUserData: authState.admin
  });
  
  // If regular customer, show customer dashboard
  if (!isAdminUser) {
    const renderCustomerPage = () => {
      switch (currentCustomerPage) {
        case 'my-orders':
          return <MyOrders 
            onNavigate={handleCustomerNavigation} 
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />;
        case 'track-orders':
          return <TrackOrders 
            onNavigate={handleCustomerNavigation}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />;
        case 'deliveries':
          return <Deliveries 
            onNavigate={handleCustomerNavigation}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />;
        case 'help-support':
          return <HelpSupport 
            onNavigate={handleCustomerNavigation}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />;
        case 'new-order':
          return <CreateOrder 
            onBack={() => handleCustomerNavigation('dashboard')}
          />;
        case 'dashboard':
        default:
          return (
            <CustomerDashboard 
              onNavigate={handleCustomerNavigation}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              onLogout={handleLogout}
            />
          );
      }
    };
    
    return (
      <div className="min-h-screen w-full bg-background">
        {renderCustomerPage()}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background">
          {/* Sidebar - fixed positioning to make it sticky */}
          <div className={`hidden md:flex flex-col fixed left-0 top-0 h-screen border-r border-border bg-sidebar z-30 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
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
                {menuSections.map((section) => (
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
                            <p className="text-sm font-semibold truncate text-sidebar-foreground">{authState.admin?.name || 'Admin User'}</p>
                            <p className="text-xs text-muted-foreground truncate">{authState.admin?.email || 'admin@globeswiftgo.com.gh'}</p>
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
                        <p className="text-sm font-semibold truncate">{authState.admin?.name || 'Admin User'}</p>
                        <p className="text-xs text-muted-foreground truncate">Administrator</p>
                        <p className="text-xs text-muted-foreground truncate">{authState.admin?.email || 'admin@globeswiftgo.com.gh'}</p>
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
                {menuSections.map((section) => (
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
          <div className={`flex-1 flex flex-col min-w-0 bg-background transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
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
                            <p className="text-sm font-semibold truncate">{authState.admin?.name || 'Admin User'}</p>
                            <p className="text-xs text-muted-foreground truncate">Administrator</p>
                            <p className="text-xs text-muted-foreground truncate">{authState.admin?.email || 'admin@globeswiftgo.com.gh'}</p>
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
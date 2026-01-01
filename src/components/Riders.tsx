import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { useRiders } from '../hooks/useRiders';
import { usePendingRiders } from '../hooks/usePendingRiders';
import { RidersFilters, PendingRiderApplication } from '../types/auth';
import { 
  Search, 
  Eye, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Upload,
  Download,
  User,
  UserCheck,
  GraduationCap,
  Shield,
  Truck,
  Calendar,
  Building,
  Navigation,
  CreditCard,
  Camera,
  FileImage,
  Edit,
  Trash2,
  Send,
  MessageSquare,
  UserPlus,
  ClipboardCheck,
  Award,
  BookOpen,
  Video,
  Target,
  CheckSquare,
  XCircle,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  PieChart,
  BarChart3,
  Settings,
  Filter,
  SortAsc,
  RefreshCw,
  ExternalLink,
  Bell,
  Info,
  ChevronRight,
  ChevronDown,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Zap,
  Globe,
  Package
} from 'lucide-react';

const riders = [
  {
    id: 'R001',
    name: 'Kwame Asante',
    email: 'kwame.asante@gmail.com',
    phone: '+233-24-456-7890',
    status: 'active',
    rating: 4.8,
    totalDeliveries: 156,
    joinDate: '2024-01-15',
    vehicle: 'Okada (Motorcycle)',
    location: 'East Legon, Accra',
    earnings: '₵6,370',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'R002',
    name: 'Ama Serwaa',
    email: 'ama.serwaa@yahoo.com',
    phone: '+233-20-123-4567',
    status: 'active',
    rating: 4.9,
    totalDeliveries: 203,
    joinDate: '2023-11-20',
    vehicle: 'Bicycle',
    location: 'Osu, Accra',
    earnings: '₵8,112',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'R003',
    name: 'Yaw Boateng',
    email: 'yaw.boateng@hotmail.com',
    phone: '+233-27-789-0123',
    status: 'offline',
    rating: 4.6,
    totalDeliveries: 89,
    joinDate: '2024-03-10',
    vehicle: 'Taxi (Hyundai)',
    location: 'Tema, Greater Accra',
    earnings: '₵4,628',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'R004',
    name: 'Kojo Mensah',
    email: 'kojo.mensah@gmail.com',
    phone: '+233-54-567-8901',
    status: 'busy',
    rating: 4.7,
    totalDeliveries: 134,
    joinDate: '2023-12-05',
    vehicle: 'Okada (Motorcycle)',
    location: 'Dansoman, Accra',
    earnings: '₵7,514',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
  }
];

interface ApplicationDocument {
  name: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  uploadDate?: string;
  expiryDate?: string;
  notes?: string;
  fileUrl?: string;
}

interface TrainingModule {
  id: string;
  name: string;
  description: string;
  duration: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  score?: number;
  completedDate?: string;
  required: boolean;
}

interface OnboardingApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  vehicle: string;
  licenseNumber: string;
  nationalId: string;
  bankAccount: {
    name: string;
    number: string;
    bank: string;
  };
  documents: {
    nationalId: ApplicationDocument;
    drivingLicense: ApplicationDocument;
    insurance: ApplicationDocument;
    vehicleRegistration: ApplicationDocument;
    backgroundCheck: ApplicationDocument;
    bankStatement: ApplicationDocument;
    medicalCertificate: ApplicationDocument;
    passport: ApplicationDocument;
  };
  training: TrainingModule[];
  applicationDate: string;
  progress: number;
  currentStep: string;
  status: 'submitted' | 'document_review' | 'background_check' | 'training' | 'final_review' | 'approved' | 'rejected';
  assignedReviewer?: string;
  reviewNotes?: string;
  equipmentAssigned?: {
    uniform: boolean;
    helmet: boolean;
    bag: boolean;
    phone: boolean;
    gps: boolean;
  };
  interviewScheduled?: {
    date: string;
    time: string;
    type: 'phone' | 'video' | 'in_person';
    interviewer: string;
    status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
    notes?: string;
  };
}

const trainingModules: TrainingModule[] = [
  {
    id: 'safety-basics',
    name: 'Road Safety Fundamentals',
    description: 'Essential safety guidelines for delivery riders',
    duration: '45 minutes',
    status: 'not_started',
    required: true
  },
  {
    id: 'customer-service',
    name: 'Customer Service Excellence',
    description: 'Delivering exceptional customer experiences',
    duration: '30 minutes',
    status: 'not_started',
    required: true
  },
  {
    id: 'app-usage',
    name: 'GlobeSwiftGo App Training',
    description: 'Complete guide to using the rider app',
    duration: '60 minutes',
    status: 'not_started',
    required: true
  },
  {
    id: 'ghana-traffic',
    name: 'Ghana Traffic Rules & Regulations',
    description: 'Local traffic laws and best practices',
    duration: '40 minutes',
    status: 'not_started',
    required: true
  },
  {
    id: 'emergency-procedures',
    name: 'Emergency Response Procedures',
    description: 'Handling accidents and emergency situations',
    duration: '35 minutes',
    status: 'not_started',
    required: true
  },
  {
    id: 'delivery-best-practices',
    name: 'Delivery Best Practices',
    description: 'Efficient and professional delivery techniques',
    duration: '25 minutes',
    status: 'not_started',
    required: false
  }
];

// Only using API data for onboarding - no mock data
const initialPendingApplications: OnboardingApplication[] = [];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    case 'offline':
      return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
    case 'busy':
      return <Badge className="bg-blue-100 text-blue-800">Busy</Badge>;
    case 'suspended':
      return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const getDocumentStatus = (status: string) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'rejected':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

export function Riders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED' | 'ONLINE' | 'OFFLINE'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(20);
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<OnboardingApplication | null>(null);
  const [isOnboardingDetailOpen, setIsOnboardingDetailOpen] = useState(false);
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false);
  const [activeOnboardingTab, setActiveOnboardingTab] = useState('applications');
  const [documentReviewMode, setDocumentReviewMode] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use the riders API hook
  const { riders, pagination, loading, error, fetchRiders, clearError } = useRiders();
  
  // Use the pending riders API hook
  const { 
    applications: apiApplications, 
    pagination: applicationsPagination,
    loading: applicationsLoading, 
    error: applicationsError, 
    fetchPendingRiders, 
    approveApplication: apiApproveApplication,
    rejectApplication: apiRejectApplication,
    clearError: clearApplicationsError 
  } = usePendingRiders();

  // Helper function to get rider initials
  const getRiderInitials = (rider: any) => {
    const name = rider.name || '';
    const email = rider.email || '';
    
    if (name) {
      const nameParts = name.split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      } else {
        return nameParts[0][0].toUpperCase();
      }
    } else if (email) {
      return email[0].toUpperCase();
    }
    return '??';
  };

  // Helper function to get rider full name
  const getRiderName = (rider: any) => {
    if (rider.name) {
      return rider.name;
    } else if (rider.email) {
      return rider.email.split('@')[0]; // Use email username as fallback
    }
    return 'Unknown Rider';
  };

  // Fetch riders when filters change
  useEffect(() => {
    const filters: RidersFilters = {
      page: currentPage,
      limit: pageLimit,
      search: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter
    };

    const debounceTimer = setTimeout(() => {
      fetchRiders(filters);
    }, 300); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter, currentPage, pageLimit, fetchRiders]);

  // Fetch pending riders on component mount and when application filter changes
  useEffect(() => {
    const filters: RidersFilters = {
      page: 1,
      limit: 50, // Get more applications for onboarding
      search: searchTerm || undefined
    };

    fetchPendingRiders(filters);
  }, [fetchPendingRiders, searchTerm]);

  // Transform API applications to match UI interface
  const transformApiApplication = (apiApp: PendingRiderApplication): OnboardingApplication => {
    return {
      id: apiApp.id.toString(),
      name: apiApp.name,
      email: apiApp.email,
      phone: '', // Not provided by API
      address: '', // Not provided by API
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      vehicle: apiApp.vehicle_details?.type + ' - ' + apiApp.vehicle_details?.model || 'Unknown Vehicle',
      licenseNumber: '',
      nationalId: apiApp.national_id,
      bankAccount: {
        name: '',
        number: '',
        bank: ''
      },
      documents: {
        nationalId: { name: 'National ID', status: apiApp.is_verified ? 'verified' : 'pending' },
        drivingLicense: { name: 'Driving License', status: 'pending' },
        insurance: { name: 'Insurance', status: 'pending' },
        vehicleRegistration: { name: 'Vehicle Registration', status: 'pending' },
        backgroundCheck: { name: 'Background Check', status: 'pending' },
        bankStatement: { name: 'Bank Statement', status: 'pending' },
        medicalCertificate: { name: 'Medical Certificate', status: 'pending' },
        passport: { name: 'Passport Photo', status: 'pending' }
      },
      training: trainingModules.map(module => ({ ...module, status: 'not_started' })),
      applicationDate: apiApp.created_at,
      progress: apiApp.status === 'PENDING' ? 25 : 50,
      currentStep: apiApp.status === 'PENDING' ? 'Application Submitted' : 'Document Review',
      status: apiApp.status === 'PENDING' ? 'submitted' : 'document_review',
      assignedReviewer: '',
      reviewNotes: '',
      equipmentAssigned: {
        uniform: false,
        helmet: false,
        bag: false,
        phone: false,
        gps: false
      }
    };
  };

  // Only use API applications for onboarding (no mock data)
  const allApplications = (apiApplications || []).map(transformApiApplication);

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as any);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Map API rider status to display badge
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'ONLINE':
        return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'OFFLINE':
        return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredApplications = allApplications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = applicationFilter === 'all' || app.status === applicationFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveApplication = async (applicationId: string) => {
    setIsProcessing(true);
    
    try {
      // Use real API for all applications (no more static data)
      await apiApproveApplication(applicationId, 'Application approved by admin');
      toast.success('Application approved successfully');
      
      setIsProcessing(false);
      
      // Close the detail modal if it's open
      if (selectedApplication?.id === applicationId) {
        setIsOnboardingDetailOpen(false);
        setSelectedApplication(null);
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error.message || 'Failed to approve application');
    }
  };

  const handleRejectApplication = async (applicationId: string, reason: string) => {
    setIsProcessing(true);
    
    try {
      // Use real API for all applications (no more static data)
      await apiRejectApplication(applicationId, reason);
      toast.success('Application rejected');
      
      setIsProcessing(false);
      
      // Close the detail modal if it's open
      if (selectedApplication?.id === applicationId) {
        setIsOnboardingDetailOpen(false);
        setSelectedApplication(null);
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error.message || 'Failed to reject application');
    }
  };

  const handleDocumentApproval = (documentType: string, approved: boolean) => {
    if (approved) {
      toast.success(`${documentType} approved`);
    } else {
      toast.error(`${documentType} rejected`);
    }
  };

  const handleTrainingAssignment = (applicationId: string, moduleId: string) => {
    toast.success('Training module assigned');
  };

  const handleEquipmentAssignment = (applicationId: string, equipment: string) => {
    toast.success(`${equipment} assigned to rider`);
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Submitted</Badge>;
      case 'document_review':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Document Review</Badge>;
      case 'background_check':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Background Check</Badge>;
      case 'training':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Training</Badge>;
      case 'final_review':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Final Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getTrainingStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-none">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Riders Management</h1>
        <p className="text-muted-foreground text-lg">Manage riders and handle onboarding applications</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Riders</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Riders</p>
                    <p className="text-3xl font-bold text-gray-900">{pagination?.total_riders || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                    <p className="text-3xl font-bold text-gray-900">{riders.filter(r => r.status === 'ONLINE' || r.status === 'ACTIVE').length}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                    <p className="text-3xl font-bold text-gray-900">4.7</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Apps</p>
                    <p className="text-3xl font-bold text-gray-900">{allApplications.length}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search riders..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rider
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Riders Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Riders ({riders.length})</CardTitle>
              <CardDescription className="text-base">All registered delivery riders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rider</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span>Loading riders...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="space-y-2">
                          <p className="text-red-600">Error loading riders: {error}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              clearError();
                              fetchRiders({
                                page: currentPage,
                                limit: pageLimit,
                                search: searchTerm || undefined,
                                status: statusFilter === 'all' ? undefined : statusFilter
                              });
                            }}
                          >
                            Retry
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : riders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="space-y-2">
                          <p className="text-muted-foreground">No riders found</p>
                          {(searchTerm || statusFilter !== 'all') && (
                            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    riders.map((rider) => (
                    <TableRow key={rider.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${rider.name}`} />
                            <AvatarFallback>
                              {getRiderInitials(rider)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{getRiderName(rider)}</p>
                            <p className="text-sm text-muted-foreground">ID: {rider.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="text-sm">{rider.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-sm">{rider.national_id || 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(rider.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{rider.average_rating ? rider.average_rating.toFixed(1) : 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{rider.total_deliveries || 0}</TableCell>
                      <TableCell>{rider.vehicle_details?.type || 'N/A'}</TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${rider.name}`} />
                                  <AvatarFallback>
                                    {getRiderInitials(rider)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-lg font-semibold">{getRiderName(rider)}</div>
                                  <div className="text-sm text-muted-foreground">Rider ID: {rider.id}</div>
                                </div>
                              </DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-6">
                              {/* Basic Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Contact Information</Label>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      <span className="text-sm">{rider.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      <span className="text-sm">{rider.national_id || 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Status & Performance</Label>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm">Status:</span>
                                      {getStatusBadge(rider.status)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span className="text-sm">Rating: {rider.average_rating ? rider.average_rating.toFixed(1) : 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Stats Cards */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold">{rider.total_deliveries || 0}</div>
                                      <div className="text-sm text-muted-foreground">Total Deliveries</div>
                                    </div>
                                  </CardContent>
                                </Card>
                                
                                <Card>
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold">$0.00</div>
                                      <div className="text-sm text-muted-foreground">Total Earnings</div>
                                    </div>
                                  </CardContent>
                                </Card>
                                
                                <Card>
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold">{rider.vehicle_details?.type || 'N/A'}</div>
                                      <div className="text-sm text-muted-foreground">Vehicle Type</div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Additional Info */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Account Information</Label>
                                <div className="text-sm space-y-1">
                                  <div>Status: {rider.is_verified ? 'Verified' : 'Pending Verification'}</div>
                                  <div>National ID: {rider.national_id || 'Not provided'}</div>
                                  {rider.vehicle_details && (
                                    <div>Vehicle: {rider.vehicle_details.model} ({rider.vehicle_details.type})</div>
                                  )}
                                </div>
                              </div>

                              {/* Timestamps */}
                              <div className="pt-4 border-t">
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <div>Joined: {new Date(rider.created_at).toLocaleDateString()}</div>
                                  <div>Last Updated: {new Date(rider.updated_at).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {riders.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * pageLimit) + 1} to {Math.min(currentPage * pageLimit, pagination?.total_riders || 0)} of {pagination?.total_riders || 0} riders
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {pagination && Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(pagination.total_pages, currentPage - 2 + i));
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            disabled={loading}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(pagination?.total_pages || 1, prev + 1))}
                      disabled={currentPage === pagination?.total_pages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          {/* Onboarding Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Applications</p>
                    <p className="text-2xl font-semibold">{allApplications.length}</p>
                    <p className="text-xs text-blue-600">+3 this week</p>
                  </div>
                  <UserPlus className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Review</p>
                    <p className="text-2xl font-semibold">{allApplications.filter(a => a.status === 'document_review').length}</p>
                    <p className="text-xs text-yellow-600">Documents pending</p>
                  </div>
                  <ClipboardCheck className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Training</p>
                    <p className="text-2xl font-semibold">{allApplications.filter(a => a.status === 'training').length}</p>
                    <p className="text-xs text-purple-600">Active learners</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-semibold">12</p>
                    <p className="text-xs text-green-600">New riders approved</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onboarding Management Tabs */}
          <Tabs value={activeOnboardingTab} onValueChange={setActiveOnboardingTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-6">
              {/* Filters */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search applications by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Select value={applicationFilter} onValueChange={setApplicationFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="document_review">Document Review</SelectItem>
                          <SelectItem value="background_check">Background Check</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="final_review">Final Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        More Filters
                      </Button>
                      <Dialog open={isNewApplicationOpen} onOpenChange={setIsNewApplicationOpen}>
                        <DialogTrigger asChild>
                          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            <UserPlus className="h-4 w-4" />
                            New Application
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Create New Rider Application</DialogTitle>
                            <DialogDescription>
                              Start a new rider onboarding application manually
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input placeholder="Enter full name" />
                              </div>
                              <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input type="email" placeholder="email@example.com" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input placeholder="+233 XX XXX XXXX" />
                              </div>
                              <div className="space-y-2">
                                <Label>Vehicle Type</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select vehicle" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bicycle">Bicycle</SelectItem>
                                    <SelectItem value="motorcycle">Motorcycle (Okada)</SelectItem>
                                    <SelectItem value="car">Car/Taxi</SelectItem>
                                    <SelectItem value="van">Van/Truck</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Address</Label>
                              <Textarea placeholder="Enter complete address including region" />
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" onClick={() => setIsNewApplicationOpen(false)}>
                                Cancel
                              </Button>
                              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                Create Application
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Applications List */}
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <Card key={app.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{app.name}</h3>
                              <p className="text-sm text-muted-foreground">Application ID: {app.id}</p>
                              <p className="text-xs text-muted-foreground">Applied: {new Date(app.applicationDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getApplicationStatusBadge(app.status)}
                            <div className="text-right">
                              <p className="text-sm font-medium">{app.currentStep}</p>
                              <p className="text-xs text-muted-foreground">{app.progress}% complete</p>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Application Progress</span>
                            <span>{app.progress}%</span>
                          </div>
                          <Progress value={app.progress} className="h-2" />
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Contact</p>
                            <p className="text-sm font-medium">{app.phone}</p>
                            <p className="text-xs text-muted-foreground">{app.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Vehicle</p>
                            <p className="text-sm font-medium">{app.vehicle}</p>
                            <p className="text-xs text-muted-foreground">{app.licenseNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Documents</p>
                            <div className="flex gap-1 mt-1">
                              {Object.values(app.documents).map((doc, index) => (
                                <div key={index} className={`w-2 h-2 rounded-full ${
                                  doc.status === 'verified' ? 'bg-green-500' : 
                                  doc.status === 'pending' ? 'bg-yellow-500' : 
                                  doc.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'
                                }`}></div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Reviewer</p>
                            <p className="text-sm font-medium">{app.assignedReviewer || 'Unassigned'}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setSelectedApplication(app);
                              setIsOnboardingDetailOpen(true);
                            }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleApproveApplication(app.id)}
                            disabled={isProcessing}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          {app.status === 'final_review' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleApproveApplication(app.id)}
                                disabled={isProcessing}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRejectApplication(app.id, 'Application rejected')}
                                disabled={isProcessing}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="training" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    Training Management
                  </CardTitle>
                  <CardDescription>Manage training modules and track progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Training Modules Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trainingModules.map((module) => (
                        <Card key={module.id} className="border-0 shadow-md">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{module.name}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                                </div>
                                {module.required && (
                                  <Badge variant="secondary" className="text-xs">Required</Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Duration: {module.duration}</span>
                                {getTrainingStatusIcon(module.status)}
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Preview
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Training Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="border-0 shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Completion Rate</p>
                              <p className="text-2xl font-semibold">87%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-600" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Average Score</p>
                              <p className="text-2xl font-semibold">92%</p>
                            </div>
                            <Target className="h-8 w-8 text-blue-600" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Active Learners</p>
                              <p className="text-2xl font-semibold">15</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-600" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="equipment" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-orange-600" />
                    Equipment Management
                  </CardTitle>
                  <CardDescription>Track and assign equipment to new riders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Equipment Inventory */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { name: 'Uniforms', available: 45, assigned: 32, icon: User },
                        { name: 'Helmets', available: 23, assigned: 28, icon: Shield },
                        { name: 'Delivery Bags', available: 18, assigned: 35, icon: Package },
                        { name: 'Smartphones', available: 12, assigned: 15, icon: Phone },
                        { name: 'GPS Devices', available: 8, assigned: 10, icon: Navigation }
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <Card key={item.name} className="border-0 shadow-md">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Icon className="h-5 w-5 text-muted-foreground" />
                                  <Badge variant="outline" className="text-xs">
                                    {item.available} left
                                  </Badge>
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.assigned} assigned
                                  </p>
                                </div>
                                <Button size="sm" variant="outline" className="w-full">
                                  Manage
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Equipment Assignment Queue */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Pending Equipment Assignments</h4>
                      {allApplications
                        .filter(app => app.status === 'training' || app.status === 'final_review')
                        .map((app) => (
                          <Card key={app.id} className="border-0 shadow-md">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>{app.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{app.name}</p>
                                    <p className="text-sm text-muted-foreground">{app.vehicle}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {Object.entries(app.equipmentAssigned || {}).map(([item, assigned]) => (
                                    <div key={item} className="flex items-center gap-1">
                                      <div className={`w-2 h-2 rounded-full ${assigned ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                      <span className="text-xs text-muted-foreground capitalize">{item}</span>
                                    </div>
                                  ))}
                                  <Button size="sm" variant="outline">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Assign
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Onboarding Workflow
                  </CardTitle>
                  <CardDescription>Manage the complete onboarding process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Workflow Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      {[
                        { step: 'Application', icon: FileText, count: 5 },
                        { step: 'Documents', icon: ClipboardCheck, count: 3 },
                        { step: 'Background', icon: Shield, count: 2 },
                        { step: 'Training', icon: GraduationCap, count: 1 },
                        { step: 'Equipment', icon: Truck, count: 1 },
                        { step: 'Approval', icon: Award, count: 2 }
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Card key={item.step} className="border-0 shadow-md">
                            <CardContent className="p-4">
                              <div className="space-y-3 text-center">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                                  <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{item.step}</p>
                                  <p className="text-2xl font-semibold">{item.count}</p>
                                  <p className="text-xs text-muted-foreground">applicants</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Process Timeline */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Standard Onboarding Process</h4>
                      <div className="space-y-4">
                        {[
                          { 
                            step: 'Application Submission', 
                            description: 'Candidate submits initial application with basic information',
                            duration: '5 minutes',
                            automated: true
                          },
                          { 
                            step: 'Document Verification', 
                            description: 'Review and verify all required documents',
                            duration: '2-3 business days',
                            automated: false
                          },
                          { 
                            step: 'Background Check', 
                            description: 'Criminal background and reference verification',
                            duration: '3-5 business days',
                            automated: true
                          },
                          { 
                            step: 'Initial Interview', 
                            description: 'Video or phone interview with HR team',
                            duration: '30 minutes',
                            automated: false
                          },
                          { 
                            step: 'Training Modules', 
                            description: 'Complete mandatory safety and app training',
                            duration: '4-6 hours',
                            automated: true
                          },
                          { 
                            step: 'Equipment Assignment', 
                            description: 'Distribute uniform, helmet, and delivery equipment',
                            duration: '1 hour',
                            automated: false
                          },
                          { 
                            step: 'Final Approval', 
                            description: 'Final review and account activation',
                            duration: '1 business day',
                            automated: false
                          }
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-medium">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium">{item.step}</h5>
                                <div className="flex items-center gap-2">
                                  <Badge variant={item.automated ? 'secondary' : 'outline'} className="text-xs">
                                    {item.automated ? 'Automated' : 'Manual'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{item.duration}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Detailed Onboarding Review Dialog */}
          <Dialog open={isOnboardingDetailOpen} onOpenChange={setIsOnboardingDetailOpen}>
            <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] overflow-y-auto">
              {selectedApplication && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                      Onboarding Review - {selectedApplication.name}
                    </DialogTitle>
                    <DialogDescription>
                      Complete application review and management
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-8">
                    {/* Application Overview Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10 p-8 rounded-xl border border-blue-100 dark:border-blue-900/30">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                            <User className="h-10 w-10 text-white" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h2 className="text-2xl font-semibold text-foreground">{selectedApplication.name}</h2>
                            <p className="text-sm text-muted-foreground font-mono">{selectedApplication.id}</p>
                            <p className="text-sm text-muted-foreground">{selectedApplication.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                <Phone className="h-3 w-3 mr-1" />
                                {selectedApplication.phone}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                {selectedApplication.vehicle}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-3">
                          {getApplicationStatusBadge(selectedApplication.status)}
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Application Date</p>
                            <p className="text-sm font-medium">
                              {new Date(selectedApplication.applicationDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          {selectedApplication.assignedReviewer && (
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Assigned Reviewer</p>
                              <p className="text-sm font-medium">{selectedApplication.assignedReviewer}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">Overall Progress</p>
                            <p className="text-xs text-muted-foreground">Current Step: {selectedApplication.currentStep}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-foreground">{selectedApplication.progress}%</p>
                            <p className="text-xs text-muted-foreground">Complete</p>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={selectedApplication.progress} className="h-4 bg-blue-100 dark:bg-blue-900/30" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80" 
                               style={{ width: `${selectedApplication.progress}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left Column - Personal Information */}
                      <div className="lg:col-span-5 space-y-6">
                        {/* Personal Details */}
                        <Card className="border-0 shadow-lg bg-card">
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <User className="h-5 w-5 text-blue-600" />
                              Personal Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Full Name</Label>
                                <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg">{selectedApplication.name}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone Number</Label>
                                <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg">{selectedApplication.phone}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email Address</Label>
                              <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg">{selectedApplication.email}</p>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">National ID Number</Label>
                              <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg font-mono">{selectedApplication.nationalId}</p>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Residential Address</Label>
                              <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg leading-relaxed">{selectedApplication.address}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Vehicle Type</Label>
                                <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg">{selectedApplication.vehicle}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">License Number</Label>
                                <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg font-mono">{selectedApplication.licenseNumber}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Emergency Contact */}
                        <Card className="border-0 shadow-lg bg-card">
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Phone className="h-5 w-5 text-green-600" />
                              Emergency Contact
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact Name</Label>
                                <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg">{selectedApplication.emergencyContact.name}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Relationship</Label>
                                <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg">{selectedApplication.emergencyContact.relationship}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone Number</Label>
                              <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg">{selectedApplication.emergencyContact.phone}</p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Banking Information */}
                        <Card className="border-0 shadow-lg bg-card">
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <CreditCard className="h-5 w-5 text-purple-600" />
                              Banking Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Account Holder</Label>
                                <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg">{selectedApplication.bankAccount.name}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bank</Label>
                                <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg">{selectedApplication.bankAccount.bank}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Account Number</Label>
                              <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg font-mono">{selectedApplication.bankAccount.number}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Right Column - Documents & Status */}
                      <div className="lg:col-span-7 space-y-6">
                        {/* Document Verification */}
                        <Card className="border-0 shadow-lg bg-card">
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <FileText className="h-5 w-5 text-orange-600" />
                              Document Verification Status
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {Object.entries(selectedApplication.documents).map(([key, doc]) => (
                                <div key={key} className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-background/50 hover:bg-muted/30 transition-colors">
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="flex-shrink-0">
                                      {getDocumentStatus(doc.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm text-foreground">{doc.name}</p>
                                      {doc.uploadDate && (
                                        <p className="text-xs text-muted-foreground">
                                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                          })}
                                        </p>
                                      )}
                                      {doc.expiryDate && (
                                        <p className="text-xs text-muted-foreground">
                                          Expires: {new Date(doc.expiryDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                          })}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    {doc.status === 'pending' && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => handleDocumentApproval(doc.name, true)}
                                          className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                                        >
                                          <CheckCircle className="h-3 w-3" />
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => handleDocumentApproval(doc.name, false)}
                                          className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                          <XCircle className="h-3 w-3" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Training Progress */}
                        <Card className="border-0 shadow-lg bg-card">
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <GraduationCap className="h-5 w-5 text-indigo-600" />
                              Training Progress
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedApplication.training.slice(0, 6).map((module) => (
                                <div key={module.id} className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-background/50">
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="flex-shrink-0">
                                      {getTrainingStatusIcon(module.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm text-foreground">{module.name}</p>
                                      <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs text-muted-foreground">{module.duration}</p>
                                        {module.required && (
                                          <Badge variant="secondary" className="text-xs px-2 py-0.5">Required</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    {module.score && (
                                      <p className="text-sm font-medium text-foreground">{module.score}%</p>
                                    )}
                                    {module.completedDate && (
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(module.completedDate).toLocaleDateString('en-US', { 
                                          month: 'short', 
                                          day: 'numeric' 
                                        })}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {selectedApplication.training.length > 6 && (
                                <Button variant="outline" className="w-full" size="sm">
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  View All {selectedApplication.training.length} Modules
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Interview Details */}
                        {selectedApplication.interviewScheduled && (
                          <Card className="border-0 shadow-lg bg-card">
                            <CardHeader className="pb-4">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5 text-emerald-600" />
                                Interview Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date & Time</Label>
                                  <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg">
                                    {selectedApplication.interviewScheduled.date} at {selectedApplication.interviewScheduled.time}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Interview Type</Label>
                                  <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg capitalize">
                                    {selectedApplication.interviewScheduled.type.replace('_', ' ')}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Interviewer</Label>
                                  <p className="text-sm font-medium text-foreground p-3 bg-muted/30 rounded-lg">
                                    {selectedApplication.interviewScheduled.interviewer}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</Label>
                                  <div className="p-3 bg-muted/30 rounded-lg">
                                    <Badge className={
                                      selectedApplication.interviewScheduled.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                                      selectedApplication.interviewScheduled.status === 'scheduled' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                      'bg-yellow-100 text-yellow-800 border-yellow-200'
                                    }>
                                      {selectedApplication.interviewScheduled.status.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              {selectedApplication.interviewScheduled.notes && (
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Interview Notes</Label>
                                  <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                    <p className="text-sm text-foreground leading-relaxed">
                                      {selectedApplication.interviewScheduled.notes}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {/* Review Notes */}
                        {selectedApplication.reviewNotes && (
                          <Card className="border-0 shadow-lg bg-card">
                            <CardHeader className="pb-4">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <MessageSquare className="h-5 w-5 text-amber-600" />
                                Reviewer Notes
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                <p className="text-sm text-foreground leading-relaxed">
                                  {selectedApplication.reviewNotes}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button 
                        variant="outline"
                        onClick={() => setIsOnboardingDetailOpen(false)}
                      >
                        Close
                      </Button>
                      <Button 
                        variant="outline"
                        className="gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Send Message
                      </Button>
                      <Button 
                        variant="outline"
                        className="gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Schedule Interview
                      </Button>
                      {selectedApplication.status === 'final_review' && (
                        <>
                          <Button 
                            onClick={() => handleApproveApplication(selectedApplication.id)}
                            disabled={isProcessing}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve Application
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => handleRejectApplication(selectedApplication.id, 'Application rejected')}
                            disabled={isProcessing}
                            className="gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject Application
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="space-y-8">
            {/* Analytics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Onboarding Rate</p>
                      <p className="text-3xl font-semibold">87%</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">+5.2%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Avg. Process Time</p>
                      <p className="text-3xl font-semibold">5.2 days</p>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">-1.3 days</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Training Completion</p>
                      <p className="text-3xl font-semibold">92%</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">+3.1%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Monthly Recruitment</p>
                      <p className="text-3xl font-semibold">28</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">+12</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="onboarding" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="training">Training</TabsTrigger>
                <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
              </TabsList>

              <TabsContent value="onboarding" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Onboarding Funnel */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Onboarding Funnel
                      </CardTitle>
                      <CardDescription>Application to approval conversion rates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { stage: 'Applications Received', count: 156, percentage: 100, color: 'bg-blue-500' },
                          { stage: 'Document Review', count: 142, percentage: 91, color: 'bg-yellow-500' },
                          { stage: 'Background Check', count: 128, percentage: 82, color: 'bg-purple-500' },
                          { stage: 'Training Started', count: 115, percentage: 74, color: 'bg-indigo-500' },
                          { stage: 'Training Completed', count: 108, percentage: 69, color: 'bg-emerald-500' },
                          { stage: 'Final Approval', count: 96, percentage: 62, color: 'bg-green-500' }
                        ].map((stage, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{stage.stage}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{stage.count}</span>
                                <span className="text-sm font-medium">{stage.percentage}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${stage.color} transition-all duration-500`}
                                style={{ width: `${stage.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Application Status Distribution */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-green-600" />
                        Current Applications
                      </CardTitle>
                      <CardDescription>Status breakdown of active applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { status: 'Document Review', count: 8, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
                          { status: 'Background Check', count: 5, color: 'bg-purple-500', textColor: 'text-purple-700' },
                          { status: 'Training', count: 3, color: 'bg-indigo-500', textColor: 'text-indigo-700' },
                          { status: 'Final Review', count: 2, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
                          { status: 'Approved', count: 12, color: 'bg-green-500', textColor: 'text-green-700' },
                          { status: 'Rejected', count: 4, color: 'bg-red-500', textColor: 'text-red-700' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                              <span className="font-medium">{item.status}</span>
                            </div>
                            <div className="text-right">
                              <span className={`font-semibold ${item.textColor}`}>{item.count}</span>
                              <span className="text-sm text-muted-foreground ml-1">applications</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Document Verification Analytics */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      Document Verification Analytics
                    </CardTitle>
                    <CardDescription>Document approval rates and common issues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { 
                          document: 'National ID', 
                          approved: 95, 
                          rejected: 3, 
                          pending: 2,
                          commonIssue: 'Blurry image quality'
                        },
                        { 
                          document: 'Driving License', 
                          approved: 89, 
                          rejected: 8, 
                          pending: 3,
                          commonIssue: 'Expired license'
                        },
                        { 
                          document: 'Insurance', 
                          approved: 78, 
                          rejected: 15, 
                          pending: 7,
                          commonIssue: 'Coverage insufficient'
                        },
                        { 
                          document: 'Vehicle Registration', 
                          approved: 85, 
                          rejected: 10, 
                          pending: 5,
                          commonIssue: 'Name mismatch'
                        }
                      ].map((doc, index) => (
                        <div key={index} className="space-y-3 p-4 border rounded-lg bg-background/50">
                          <h4 className="font-medium">{doc.document}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-green-600">Approved</span>
                              <span className="font-medium">{doc.approved}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-red-600">Rejected</span>
                              <span className="font-medium">{doc.rejected}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-yellow-600">Pending</span>
                              <span className="font-medium">{doc.pending}%</span>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground">Common Issue:</p>
                            <p className="text-xs font-medium">{doc.commonIssue}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Time Analytics */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-indigo-600" />
                      Processing Time Analysis
                    </CardTitle>
                    <CardDescription>Average time spent in each onboarding stage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { stage: 'Application', avgTime: '0.5 hours', target: '1 hour', status: 'good' },
                        { stage: 'Document Review', avgTime: '2.3 days', target: '2 days', status: 'warning' },
                        { stage: 'Background Check', avgTime: '4.1 days', target: '3 days', status: 'attention' },
                        { stage: 'Interview', avgTime: '1.2 days', target: '1 day', status: 'warning' },
                        { stage: 'Training', avgTime: '3.8 days', target: '4 days', status: 'good' },
                        { stage: 'Final Approval', avgTime: '0.8 days', target: '1 day', status: 'good' }
                      ].map((item, index) => (
                        <div key={index} className="text-center p-4 border rounded-lg bg-background/50">
                          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                            item.status === 'good' ? 'bg-green-500' :
                            item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <h4 className="font-medium text-sm">{item.stage}</h4>
                          <p className="text-lg font-semibold mt-1">{item.avgTime}</p>
                          <p className="text-xs text-muted-foreground">Target: {item.target}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Rider Performance Metrics */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-600" />
                        Top Performing Riders
                      </CardTitle>
                      <CardDescription>Best riders by rating and delivery count</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {riders.slice(0, 5).map((rider, index) => (
                          <div key={rider.id} className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">{index + 1}</span>
                              </div>
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={rider.avatar} />
                                <AvatarFallback>{rider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{rider.name}</p>
                                <p className="text-sm text-muted-foreground">{rider.vehicle}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{rider.rating}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{rider.totalDeliveries} deliveries</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rider Activity Distribution */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-600" />
                        Rider Activity Status
                      </CardTitle>
                      <CardDescription>Current status distribution of all riders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { status: 'Active', count: 32, percentage: 71, color: 'bg-green-500' },
                          { status: 'Busy', count: 8, percentage: 18, color: 'bg-blue-500' },
                          { status: 'Offline', count: 4, percentage: 9, color: 'bg-gray-500' },
                          { status: 'Suspended', count: 1, percentage: 2, color: 'bg-red-500' }
                        ].map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="font-medium">{item.status}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{item.count} riders</span>
                                <span className="text-sm font-medium">{item.percentage}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Average Rating</p>
                          <p className="text-2xl font-semibold">4.7</p>
                          <p className="text-xs text-green-600">+0.2 this month</p>
                        </div>
                        <Star className="h-8 w-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Rate</p>
                          <p className="text-2xl font-semibold">96.2%</p>
                          <p className="text-xs text-green-600">+1.5% this month</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Response Time</p>
                          <p className="text-2xl font-semibold">3.2 min</p>
                          <p className="text-xs text-green-600">-0.8 min</p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                          <p className="text-2xl font-semibold">₵7,520</p>
                          <p className="text-xs text-green-600">+₵450</p>
                        </div>
                        <CreditCard className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="training" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Training Completion Rates */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-indigo-600" />
                        Training Module Performance
                      </CardTitle>
                      <CardDescription>Completion rates and average scores by module</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trainingModules.map((module, index) => (
                          <div key={module.id} className="space-y-2 p-3 border rounded-lg bg-background/50">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{module.name}</p>
                                <p className="text-xs text-muted-foreground">{module.duration}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{85 + index * 2}% completion</p>
                                <p className="text-xs text-muted-foreground">Avg: {88 + index}%</p>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${85 + index * 2}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Training Timeline */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                        Training Progress Timeline
                      </CardTitle>
                      <CardDescription>Recent training activities and milestones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { 
                            date: '2 hours ago',
                            event: 'Efua Mensah completed Road Safety Fundamentals',
                            score: '95%',
                            type: 'completion'
                          },
                          { 
                            date: '5 hours ago',
                            event: 'Kofi Adjei started Customer Service Excellence',
                            score: null,
                            type: 'start'
                          },
                          { 
                            date: '1 day ago',
                            event: 'Akosua Osei completed App Training',
                            score: '88%',
                            type: 'completion'
                          },
                          { 
                            date: '2 days ago',
                            event: 'New batch of 5 riders started training',
                            score: null,
                            type: 'batch'
                          }
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-background/50">
                            <div className={`w-3 h-3 rounded-full mt-1 ${
                              item.type === 'completion' ? 'bg-green-500' :
                              item.type === 'start' ? 'bg-blue-500' : 'bg-purple-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.event}</p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-muted-foreground">{item.date}</p>
                                {item.score && (
                                  <Badge variant="secondary" className="text-xs">
                                    Score: {item.score}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Training Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Overall Completion</p>
                          <p className="text-2xl font-semibold">92%</p>
                          <p className="text-xs text-green-600">+5% this month</p>
                        </div>
                        <CheckSquare className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Average Score</p>
                          <p className="text-2xl font-semibold">89%</p>
                          <p className="text-xs text-green-600">+2% this month</p>
                        </div>
                        <Target className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Learners</p>
                          <p className="text-2xl font-semibold">15</p>
                          <p className="text-xs text-blue-600">Currently training</p>
                        </div>
                        <BookOpen className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recruitment" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recruitment Sources */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        Recruitment Sources
                      </CardTitle>
                      <CardDescription>Where our best riders come from</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { source: 'Social Media', count: 45, percentage: 38, quality: 'High' },
                          { source: 'Referrals', count: 32, percentage: 27, quality: 'Excellent' },
                          { source: 'Job Portals', count: 25, percentage: 21, quality: 'Medium' },
                          { source: 'Walk-ins', count: 17, percentage: 14, quality: 'Good' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
                            <div>
                              <p className="font-medium">{item.source}</p>
                              <p className="text-sm text-muted-foreground">{item.count} applications</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{item.percentage}%</p>
                              <Badge variant={
                                item.quality === 'Excellent' ? 'default' :
                                item.quality === 'High' ? 'secondary' : 'outline'
                              } className="text-xs">
                                {item.quality}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Recruitment Trend */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                        Monthly Recruitment
                      </CardTitle>
                      <CardDescription>Applications and approvals over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { month: 'Jan', applications: 45, approved: 32, rate: 71 },
                          { month: 'Feb', applications: 52, approved: 38, rate: 73 },
                          { month: 'Mar', applications: 38, approved: 28, rate: 74 },
                          { month: 'Apr', applications: 65, approved: 48, rate: 74 },
                          { month: 'May', applications: 58, approved: 42, rate: 72 },
                          { month: 'Jun', applications: 71, approved: 55, rate: 77 }
                        ].map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{item.month}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">{item.applications} → {item.approved}</span>
                                <span className="text-sm font-medium">{item.rate}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                style={{ width: `${item.rate}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recruitment Insights */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      Recruitment Insights
                    </CardTitle>
                    <CardDescription>Key metrics and demographics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium">Demographics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Age 18-25</span>
                            <span className="text-sm font-medium">35%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Age 26-35</span>
                            <span className="text-sm font-medium">45%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Age 36+</span>
                            <span className="text-sm font-medium">20%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Vehicle Types</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Motorcycle</span>
                            <span className="text-sm font-medium">58%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Bicycle</span>
                            <span className="text-sm font-medium">25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Car/Taxi</span>
                            <span className="text-sm font-medium">17%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Regions</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Greater Accra</span>
                            <span className="text-sm font-medium">62%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Ashanti</span>
                            <span className="text-sm font-medium">23%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Other Regions</span>
                            <span className="text-sm font-medium">15%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Experience</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">New to delivery</span>
                            <span className="text-sm font-medium">42%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">1-2 years</span>
                            <span className="text-sm font-medium">35%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">3+ years</span>
                            <span className="text-sm font-medium">23%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
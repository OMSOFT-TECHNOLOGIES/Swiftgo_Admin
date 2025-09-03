import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  Filter, 
  Eye, 
  Mail, 
  Clock, 
  BarChart3, 
  DollarSign, 
  Users, 
  Package, 
  Truck, 
  MapPin,
  TrendingUp,
  TrendingDown,
  Activity,
  FileSpreadsheet,
  FileImage,
  Printer,
  Share2,
  Settings,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  PlayCircle,
  PauseCircle,
  Copy,
  BookOpen,
  PieChart,
  BarChart,
  LineChart,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Target,
  Zap,
  Shield
} from 'lucide-react';
// Simple date utilities since date-fns is not available
const formatDate = (date: Date, pattern: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  if (pattern === 'MMM dd') {
    return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`;
  } else if (pattern === 'MMM dd, yyyy') {
    return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
  } else if (pattern === 'MMMM dd, yyyy') {
    return `${monthsFull[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
  }
  return date.toLocaleDateString();
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const subDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const startOfWeek = (date: Date, options?: { weekStartsOn: number }) => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (options?.weekStartsOn === 1 ? (day === 0 ? -6 : 1) : 0);
  result.setDate(diff);
  return result;
};

const endOfWeek = (date: Date, options?: { weekStartsOn: number }) => {
  const result = startOfWeek(date, options);
  result.setDate(result.getDate() + 6);
  return result;
};

const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  lastGenerated?: string;
  size?: string;
  status: 'active' | 'draft' | 'scheduled';
  frequency?: string;
  nextRun?: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  template: string;
  frequency: string;
  nextRun: string;
  recipients: string[];
  status: 'active' | 'paused';
  lastRun?: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'sales-summary',
    name: 'Sales Summary Report',
    description: 'Comprehensive sales performance and revenue analysis',
    category: 'Sales',
    icon: DollarSign,
    lastGenerated: '2 hours ago',
    size: '2.1 MB',
    status: 'active',
    frequency: 'Daily',
    nextRun: 'Tomorrow 9:00 AM'
  },
  {
    id: 'operational-overview',
    name: 'Operational Overview',
    description: 'Delivery performance, completion rates, and efficiency metrics',
    category: 'Operations',
    icon: Activity,
    lastGenerated: '1 day ago',
    size: '1.8 MB',
    status: 'active',
    frequency: 'Weekly',
    nextRun: 'Monday 6:00 AM'
  },
  {
    id: 'rider-performance',
    name: 'Rider Performance Analysis',
    description: 'Individual and team rider performance metrics and rankings',
    category: 'HR',
    icon: Users,
    lastGenerated: '3 hours ago',
    size: '1.5 MB',
    status: 'active',
    frequency: 'Weekly',
    nextRun: 'Sunday 8:00 PM'
  },
  {
    id: 'customer-analytics',
    name: 'Customer Analytics',
    description: 'Customer behavior, satisfaction, and retention analysis',
    category: 'Marketing',
    icon: Target,
    lastGenerated: '5 hours ago',
    size: '3.2 MB',
    status: 'active',
    frequency: 'Monthly',
    nextRun: '1st of next month'
  },
  {
    id: 'financial-statement',
    name: 'Financial Statement',
    description: 'Detailed financial performance and accounting summary',
    category: 'Finance',
    icon: BarChart3,
    lastGenerated: '1 day ago',
    size: '4.1 MB',
    status: 'active',
    frequency: 'Monthly',
    nextRun: '1st of next month'
  },
  {
    id: 'geographic-analysis',
    name: 'Geographic Performance',
    description: 'Regional performance analysis across Ghana',
    category: 'Analytics',
    icon: MapPin,
    lastGenerated: '6 hours ago',
    size: '2.8 MB',
    status: 'active',
    frequency: 'Weekly',
    nextRun: 'Friday 5:00 PM'
  },
  {
    id: 'inventory-tracking',
    name: 'Inventory & Assets',
    description: 'Vehicle fleet, equipment, and asset management report',
    category: 'Operations',
    icon: Package,
    lastGenerated: '2 days ago',
    size: '1.2 MB',
    status: 'draft'
  },
  {
    id: 'compliance-audit',
    name: 'Compliance Audit',
    description: 'Regulatory compliance and audit trail documentation',
    category: 'Legal',
    icon: Shield,
    lastGenerated: '1 week ago',
    size: '5.3 MB',
    status: 'scheduled',
    frequency: 'Quarterly',
    nextRun: 'Next quarter'
  }
];

const scheduledReports: ScheduledReport[] = [
  {
    id: 'sch-001',
    name: 'Daily Sales Report',
    template: 'sales-summary',
    frequency: 'Daily',
    nextRun: 'Tomorrow 9:00 AM',
    recipients: ['admin@globeswiftgo.com.gh', 'finance@globeswiftgo.com.gh'],
    status: 'active',
    lastRun: 'Today 9:00 AM'
  },
  {
    id: 'sch-002',
    name: 'Weekly Operations Review',
    template: 'operational-overview',
    frequency: 'Weekly',
    nextRun: 'Monday 6:00 AM',
    recipients: ['operations@globeswiftgo.com.gh', 'management@globeswiftgo.com.gh'],
    status: 'active',
    lastRun: 'Last Monday 6:00 AM'
  },
  {
    id: 'sch-003',
    name: 'Monthly Financial Summary',
    template: 'financial-statement',
    frequency: 'Monthly',
    nextRun: '1st of next month',
    recipients: ['ceo@globeswiftgo.com.gh', 'finance@globeswiftgo.com.gh', 'board@globeswiftgo.com.gh'],
    status: 'active',
    lastRun: '1st of this month'
  },
  {
    id: 'sch-004',
    name: 'Rider Performance Review',
    template: 'rider-performance',
    frequency: 'Bi-weekly',
    nextRun: 'Next Friday 6:00 PM',
    recipients: ['hr@globeswiftgo.com.gh', 'operations@globeswiftgo.com.gh'],
    status: 'paused'
  }
];

export function Reports() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const categories = ['all', 'Sales', 'Operations', 'HR', 'Marketing', 'Finance', 'Analytics', 'Legal'];

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGenerateReport = async (template: ReportTemplate) => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`${template.name} generated successfully`);
    }, 3000);
  };

  const handleExportReport = async (template: ReportTemplate, format: string) => {
    setIsGenerating(true);
    
    // Simulate export
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`${template.name} exported as ${format.toUpperCase()}`);
    }, 2000);
  };

  const handleScheduleReport = () => {
    toast.success('Report scheduled successfully');
    setIsScheduleDialogOpen(false);
  };

  const handleToggleScheduledReport = (reportId: string) => {
    const report = scheduledReports.find(r => r.id === reportId);
    if (report) {
      const newStatus = report.status === 'active' ? 'paused' : 'active';
      toast.success(`Report ${newStatus === 'active' ? 'activated' : 'paused'}`);
    }
  };

  const getQuickDateRange = (range: string) => {
    const today = new Date();
    switch (range) {
      case 'today':
        return { from: today, to: today };
      case 'yesterday':
        return { from: subDays(today, 1), to: subDays(today, 1) };
      case 'last7days':
        return { from: subDays(today, 7), to: today };
      case 'last30days':
        return { from: subDays(today, 30), to: today };
      case 'thisweek':
        return { from: startOfWeek(today, { weekStartsOn: 1 }), to: endOfWeek(today, { weekStartsOn: 1 }) };
      case 'thismonth':
        return { from: startOfMonth(today), to: endOfMonth(today) };
      default:
        return dateRange;
    }
  };

  const formatCurrency = (value: number) => `₵ ${value.toLocaleString()}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'draft': return 'Draft';
      case 'scheduled': return 'Scheduled';
      case 'paused': return 'Paused';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Reports</h1>
            <p className="text-muted-foreground text-lg">Generate and manage business reports</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4" />
              Create Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reports Generated</p>
                  <p className="text-2xl font-semibold">1,247</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Reports</p>
                  <p className="text-2xl font-semibold">{scheduledReports.length}</p>
                  <p className="text-xs text-blue-600">{scheduledReports.filter(r => r.status === 'active').length} active</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Templates</p>
                  <p className="text-2xl font-semibold">{reportTemplates.length}</p>
                  <p className="text-xs text-purple-600">{reportTemplates.filter(t => t.status === 'active').length} active</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-semibold">24.3 GB</p>
                  <p className="text-xs text-orange-600">68% of 36 GB</p>
                </div>
                <FileSpreadsheet className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="text-sm font-medium">Search Reports</Label>
                  <Input
                    id="search"
                    placeholder="Search by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="w-full lg:w-48">
                  <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full lg:w-48">
                  <Label htmlFor="format" className="text-sm font-medium">Export Format</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV File</SelectItem>
                      <SelectItem value="png">PNG Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(template.status)}`}></div>
                            <span className="text-xs text-muted-foreground">{getStatusText(template.status)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm mt-2">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {template.lastGenerated && (
                        <div className="text-xs text-muted-foreground">
                          Last generated: {template.lastGenerated}
                          {template.size && ` • ${template.size}`}
                        </div>
                      )}
                      
                      {template.frequency && (
                        <div className="text-xs text-muted-foreground">
                          Frequency: {template.frequency}
                          {template.nextRun && ` • Next: ${template.nextRun}`}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleGenerateReport(template)}
                          disabled={isGenerating}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-3 w-3 mr-1" />
                              Generate
                            </>
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setIsPreviewOpen(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExportReport(template, selectedFormat)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Scheduled Reports</h3>
              <p className="text-sm text-muted-foreground">Automated report generation and distribution</p>
            </div>
            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="h-4 w-4" />
                  Schedule Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule New Report</DialogTitle>
                  <DialogDescription>
                    Set up automated report generation and delivery
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Report Template</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Report Name</Label>
                    <Input placeholder="Enter custom name for scheduled report" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Recipients</Label>
                    <Input placeholder="Enter email addresses separated by commas" />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleScheduleReport} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Schedule Report
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {scheduledReports.map((report) => (
              <Card key={report.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
                        <div>
                          <h4 className="font-medium">{report.name}</h4>
                          <p className="text-sm text-muted-foreground">Template: {report.template}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{report.frequency}</p>
                        <p className="text-xs text-muted-foreground">Next: {report.nextRun}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleScheduledReport(report.id)}
                        >
                          {report.status === 'active' ? (
                            <PauseCircle className="h-4 w-4" />
                          ) : (
                            <PlayCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{report.recipients.length} recipients</span>
                      </div>
                      {report.lastRun && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Last run: {report.lastRun}</span>
                        </div>
                      )}
                    </div>
                    <Badge className={getStatusColor(report.status).replace('bg-', 'bg-').replace('-500', '/10 text-').replace('-500', '-600')}>
                      {getStatusText(report.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Report History</h3>
              <p className="text-sm text-muted-foreground">Previously generated reports and archives</p>
            </div>
            <div className="flex gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(dateRange.from, "MMM dd")} - {formatDate(dateRange.to, "MMM dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Today', value: 'today' },
                        { label: 'Yesterday', value: 'yesterday' },
                        { label: 'Last 7 days', value: 'last7days' },
                        { label: 'Last 30 days', value: 'last30days' },
                        { label: 'This week', value: 'thisweek' },
                        { label: 'This month', value: 'thismonth' }
                      ].map((range) => (
                        <Button
                          key={range.value}
                          variant="outline"
                          size="sm"
                          onClick={() => setDateRange(getQuickDateRange(range.value))}
                        >
                          {range.label}
                        </Button>
                      ))}
                    </div>
                    <Separator />
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange({ from: range.from, to: range.to });
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Report History Table */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {[
                  {
                    name: 'Daily Sales Report',
                    template: 'Sales Summary',
                    generatedAt: 'Today 9:00 AM',
                    generatedBy: 'System',
                    size: '2.1 MB',
                    format: 'PDF',
                    downloads: 12
                  },
                  {
                    name: 'Weekly Operations Review',
                    template: 'Operational Overview',
                    generatedAt: 'Yesterday 6:00 PM',
                    generatedBy: 'Joseph Mensah',
                    size: '1.8 MB',
                    format: 'Excel',
                    downloads: 8
                  },
                  {
                    name: 'Customer Analytics Report',
                    template: 'Customer Analytics',
                    generatedAt: '2 days ago',
                    generatedBy: 'System',
                    size: '3.2 MB',
                    format: 'PDF',
                    downloads: 15
                  },
                  {
                    name: 'Rider Performance Analysis',
                    template: 'Rider Performance',
                    generatedAt: '3 days ago',
                    generatedBy: 'Akosua Frimpong',
                    size: '1.5 MB',
                    format: 'Excel',
                    downloads: 6
                  },
                  {
                    name: 'Financial Statement',
                    template: 'Financial Summary',
                    generatedAt: '1 week ago',
                    generatedBy: 'System',
                    size: '4.1 MB',
                    format: 'PDF',
                    downloads: 23
                  }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{report.template}</span>
                          <span>•</span>
                          <span>{report.generatedAt}</span>
                          <span>•</span>
                          <span>by {report.generatedBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="secondary">{report.format}</Badge>
                          <span className="text-muted-foreground">{report.size}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{report.downloads} downloads</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" title="Share">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" title="Print">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <selectedTemplate.icon className="h-5 w-5" />
                  {selectedTemplate.name} Preview
                </DialogTitle>
                <DialogDescription>
                  Preview of the {selectedTemplate.name} report template
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Mock Report Preview */}
                <div className="border rounded-lg p-6 bg-white dark:bg-gray-900 space-y-6">
                  {/* Report Header */}
                  <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">GlobeSwiftGo Delivery Service</h1>
                    <h2 className="text-xl">{selectedTemplate.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Generated on {formatDate(new Date(), 'MMMM dd, yyyy')} • Report Period: {formatDate(dateRange.from, 'MMM dd')} - {formatDate(dateRange.to, 'MMM dd, yyyy')}
                    </p>
                  </div>

                  <Separator />

                  {/* Executive Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Executive Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold text-blue-600">₵ 247,830</p>
                        <p className="text-xs text-green-600">+12.5% vs previous period</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Orders Completed</p>
                        <p className="text-2xl font-bold text-green-600">1,247</p>
                        <p className="text-xs text-green-600">+8.3% vs previous period</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                        <p className="text-2xl font-bold text-purple-600">4.7/5</p>
                        <p className="text-xs text-green-600">+0.2 vs previous period</p>
                      </div>
                    </div>
                  </div>

                  {/* Sample Chart */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Performance Metrics</h3>
                    <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Chart visualization would appear here</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Key Insights</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <p className="text-sm">Peak delivery hours are between 6-8 PM with 35% of daily orders</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <p className="text-sm">Greater Accra region shows 15% higher demand than other regions</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                        <p className="text-sm">Mobile Money payments account for 78% of all transactions</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                    Close Preview
                  </Button>
                  <Button 
                    onClick={() => handleGenerateReport(selectedTemplate)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
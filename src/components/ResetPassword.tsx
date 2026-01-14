import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { useAuth } from '../hooks/useAuth';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Shield, 
  MapPin, 
  Truck,
  Sun,
  Moon,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

// Fallback logo using data URI - replace with your actual logo
const globeSwiftGoLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzMxNzhGRiIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTYgMTJIMjBWMjhIMTZWMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';

interface ResetPasswordProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export function ResetPassword({ isDarkMode, toggleTheme }: ResetPasswordProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, loading, error, clearError } = useAuth();
  
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      navigate('/login');
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing errors
    clearError();
    setValidationError('');

    // Validation
    if (!password) {
      setValidationError('Password is required');
      return;
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (!token) {
      setValidationError('Invalid reset token');
      return;
    }

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      // Error is handled by the useAuth hook
      console.error('Password reset failed:', error);
    }
  };

  const features = [
    { icon: Truck, text: "Secure password reset" },
    { icon: Shield, text: "Protected admin access" },
    { icon: MapPin, text: "Ghana-wide coverage" }
  ];

  const goToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-accent/30 flex items-center justify-center p-4">
        {/* Navigation & Theme Toggle */}
        <div className="absolute top-6 right-6 flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="hover:bg-accent rounded-lg transition-colors p-2"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </Button>
        </div>

        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-card text-center">
            <CardHeader className="space-y-4 pb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-green-700 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-green-600">
                  Password Reset Successful
                </CardTitle>
                <CardDescription className="text-base">
                  Your password has been successfully updated. You can now sign in with your new password.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Redirecting to login page in a few seconds...
                </p>
              </div>

              <Button 
                onClick={goToLogin}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg transition-all duration-200"
              >
                Go to Login Page
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 GlobeSwiftGo. Powering logistics across Ghana.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-accent/30 flex items-center justify-center p-4">
      {/* Navigation & Theme Toggle */}
      <div className="absolute top-6 right-6 flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={goToLogin}
          className="hover:bg-accent rounded-lg transition-colors p-2"
          title="Back to login"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleTheme}
          className="hover:bg-accent rounded-lg transition-colors p-2"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700" />
          )}
        </Button>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex flex-col space-y-8 p-8">
          {/* Logo & Branding */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <img 
                  src={globeSwiftGoLogo} 
                  alt="GlobeSwiftGo Logo" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">GlobeSwiftGo</h1>
                <p className="text-lg text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Reset Your Password
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Create a new secure password for your administrator account. Your new password will be used to access the dashboard and manage deliveries across Ghana.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-card border border-border shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-card">
            <CardHeader className="space-y-4 pb-8">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                  <img 
                    src={globeSwiftGoLogo} 
                    alt="GlobeSwiftGo Logo" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">GlobeSwiftGo</h1>
                  <p className="text-sm text-muted-foreground">Admin Portal</p>
                </div>
              </div>

              <div className="text-center space-y-2">
                <CardTitle className="text-2xl font-semibold">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-base">
                  Enter your new password below to complete the reset process
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {(error || validationError) && (
                  <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error || validationError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 bg-input-background border-border focus:border-primary"
                        required
                        disabled={loading}
                        minLength={8}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 bg-input-background border-border focus:border-primary"
                        required
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-sm text-destructive">Passwords do not match</p>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg transition-all duration-200"
                  disabled={loading || password !== confirmPassword || !password || !confirmPassword}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={goToLogin}
                    className="text-primary hover:underline font-medium transition-colors"
                    disabled={loading}
                  >
                    Back to Login
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Features */}
          <div className="lg:hidden mt-8 space-y-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-card/50 border border-border/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-foreground font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 GlobeSwiftGo. Powering logistics across Ghana.
        </p>
      </div>
    </div>
  );
}
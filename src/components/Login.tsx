import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAuth } from '../hooks/useAuth';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield, 
  MapPin, 
  Truck,
  Sun,
  Moon,
  AlertCircle,
  Loader2,
  ArrowLeft,
  User,
  Chrome
} from 'lucide-react';
// Fallback logo using data URI - replace with your actual logo
const globeSwiftGoLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzMxNzhGRiIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTYgMTJIMjBWMjhIMTZWMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';

interface LoginProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onBack?: () => void; // Optional back navigation function
}

export function Login({ isDarkMode, toggleTheme, onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const { login, signup, googleAuth, forgotPassword, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing errors
    clearError();

    // Basic validation
    if (!email || !password) {
      return;
    }

    if (!email.includes('@')) {
      return;
    }

    if (password.length < 6) {
      return;
    }

    // Additional validation for signup
    if (isSignupMode) {
      if (!fullName.trim()) {
        return;
      }
      if (password !== confirmPassword) {
        return;
      }
      // Ensure full name has at least 2 characters
      if (fullName.trim().length < 2) {
        return;
      }
      // Check for valid email format more thoroughly
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return;
      }
    }

    try {
      if (isSignupMode) {
        // Use actual signup function
        const isAdminSignup = email.toLowerCase().includes('admin');
        console.log(`Attempting ${isAdminSignup ? 'admin' : 'user'} signup for:`, email);
        
        await signup({ 
          fullName, 
          email, 
          password, 
          type: isAdminSignup ? 'admin' : 'user' 
        });
        console.log('Signup successful for:', email);
      } else {
        // Check if this is an admin or regular user login
        const isAdminLogin = email.toLowerCase().includes('admin');
        console.log(`Attempting ${isAdminLogin ? 'admin' : 'user'} login for:`, email);
        
        await login({ email, password, rememberMe });
        console.log('Login successful for:', email);
      }
      // Login/Signup successful - the App component will handle the redirect
    } catch (error) {
      // Error is handled by the useAuth hook
      console.error(isSignupMode ? 'Signup failed:' : 'Login failed:', error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      console.log('Google auth initiated');
      await googleAuth();
      console.log('Google authentication successful');
      // The App component will handle the redirect after auth state change
    } catch (error) {
      console.error('Google auth failed:', error);
      // Error is handled by the useAuth hook and displayed in the UI
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    clearError();
    // Reset form fields when switching modes
    setFullName('');
    setConfirmPassword('');
    setPassword('');  // Reset password for fresh start
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail || !forgotPasswordEmail.includes('@')) {
      setForgotPasswordError('Please enter a valid email address');
      return;
    }

    setForgotPasswordError('');
    setForgotPasswordSuccess('');

    try {
      const response = await forgotPassword(forgotPasswordEmail);
      setForgotPasswordSuccess(response.message || 'Password reset link sent to your email');
      setForgotPasswordEmail('');
    } catch (error) {
      setForgotPasswordError('Failed to send password reset email. Please try again.');
    }
  };

  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
    setForgotPasswordEmail(email); // Pre-fill with current email if available
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    clearError();
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotPasswordEmail('');
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
  };

  const features = [
    { icon: Truck, text: "Real-time delivery tracking" },
    { icon: MapPin, text: "Ghana-wide coverage" },
    { icon: Shield, text: "Secure admin access" }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-accent/30 flex items-center justify-center p-4">
      {/* Navigation & Theme Toggle */}
      <div className="absolute top-6 right-6 flex items-center space-x-2">
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="hover:bg-accent rounded-lg transition-colors p-2"
            title="Back to homepage"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
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
                {isSignupMode 
                  ? 'Join Ghana\'s Premier Delivery Network' 
                  : 'Manage Ghana\'s Premier Delivery Service'
                }
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {isSignupMode
                  ? 'Create your admin account to start managing deliveries, tracking orders, and coordinating your rider network across Ghana.'
                  : 'Streamline operations, track deliveries in real-time, and manage your rider network across Accra, Kumasi, Tamale, and beyond.'
                }
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Active Riders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Daily Deliveries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">16</div>
              <div className="text-sm text-muted-foreground">Cities Covered</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
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
                  {isSignupMode ? 'Create Account' : 'Welcome Back'}
                </CardTitle>
                <CardDescription className="text-base">
                  {isSignupMode 
                    ? 'Create your administrator account to get started'
                    : 'Sign in to your administrator account to access the dashboard'
                  }
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              {/* Google Sign In Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleAuth}
                className="w-full h-12 mb-6 border-2 hover:bg-accent transition-colors"
                disabled={loading}
              >
                <Chrome className="mr-3 h-5 w-5 text-blue-600" />
                Continue with Google
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Full Name Field - Only show in signup mode */}
                  {isSignupMode && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 h-12 bg-input-background border-border focus:border-primary"
                          required={isSignupMode}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="kwame.asante@globeswiftgo.com.gh"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 bg-input-background border-border focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={isSignupMode ? "Create a strong password" : "Enter your password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 bg-input-background border-border focus:border-primary"
                        required
                        disabled={loading}
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
                  </div>

                  {/* Confirm Password Field - Only show in signup mode */}
                  {isSignupMode && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 bg-input-background border-border focus:border-primary"
                          required={isSignupMode}
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
                  )}
                </div>

                {/* Remember Me - Only show in login mode */}
                {!isSignupMode && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        disabled={loading}
                      />
                      <Label htmlFor="remember" className="text-sm font-medium">
                        Remember me
                      </Label>
                    </div>
                    <Button 
                      variant="link" 
                      type="button"
                      onClick={openForgotPasswordModal}
                      className="p-0 h-auto text-sm text-primary hover:text-primary/80" 
                      disabled={loading}
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg transition-all duration-200"
                  disabled={loading || (isSignupMode && password !== confirmPassword)}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isSignupMode ? 'Creating Account...' : 'Signing In...'}</span>
                    </div>
                  ) : (
                    isSignupMode ? "Create Account" : "Sign In to Dashboard"
                  )}
                </Button>
              </form>

              {/* Toggle between login and signup */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignupMode ? 'Already have an account?' : "Don't have an account?"}
                  {' '}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary hover:underline font-medium transition-colors"
                    disabled={loading}
                  >
                    {isSignupMode ? 'Sign In' : 'Create Account'}
                  </button>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Need help accessing your account?{' '}
                  <Button variant="link" className="p-0 h-auto text-sm text-primary hover:text-primary/80">
                    Contact IT Support
                  </Button>
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

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPasswordModal} onOpenChange={setShowForgotPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Reset Password</DialogTitle>
            <DialogDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {forgotPasswordError && (
              <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{forgotPasswordError}</AlertDescription>
              </Alert>
            )}
            
            {forgotPasswordSuccess && (
              <Alert className="border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{forgotPasswordSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="forgotEmail" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="forgotEmail"
                  type="email"
                  placeholder="Enter your email address"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="pl-10 h-12 bg-input-background border-border focus:border-primary"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleForgotPassword();
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={closeForgotPasswordModal}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleForgotPassword}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={loading || !forgotPasswordEmail}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 GlobeSwiftGo. Powering logistics across Ghana.
        </p>
      </div>
    </div>
  );
}
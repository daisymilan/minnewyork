
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: '' as UserRole
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const roles: { value: UserRole; label: string }[] = [
    { value: 'CEO', label: 'CEO' },
    { value: 'CCO', label: 'Chief Commercial Officer' },
    { value: 'Commercial Director', label: 'Commercial Director' },
    { value: 'GCC Regional', label: 'GCC Regional Manager' },
    { value: 'Marketing Director', label: 'Marketing Director' },
    { value: 'Production Manager', label: 'Production Manager' },
    { value: 'Customer Support', label: 'Customer Support' },
    { value: 'Social Media Manager', label: 'Social Media Manager' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error("Error in signup form submission:", error);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4">
        <Card className="bg-black/30 border border-luxury-gold/20 w-full max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-luxury-cream mb-2">Account Created!</h2>
            <p className="text-luxury-cream/60 mb-6">
              Your account has been created successfully.
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-luxury-gold to-luxury-gold/80 hover:from-luxury-gold/80 hover:to-luxury-gold text-black font-semibold"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-luxury-gold mb-2">
            MiN NEW YORK
          </h1>
          <p className="text-luxury-cream/60">Create Your Account</p>
        </div>

        {/* Sign Up Form */}
        <Card className="bg-black/30 border border-luxury-gold/20">
          <CardHeader>
            <CardTitle className="text-luxury-cream text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-luxury-cream/80">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-black/30 border-luxury-gold/20 text-luxury-cream"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-luxury-cream/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Enter your email"
                  className="bg-black/30 border-luxury-gold/20 text-luxury-cream"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-luxury-cream/80">Role</Label>
                <Select value={formData.role} onValueChange={(value) => updateFormData('role', value as UserRole)}>
                  <SelectTrigger className="bg-black/30 border-luxury-gold/20 text-luxury-cream">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-luxury-gold/20">
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-luxury-cream/80">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="Enter your password"
                    className="bg-black/30 border-luxury-gold/20 text-luxury-cream pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-luxury-cream/60"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-luxury-cream/80">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className="bg-black/30 border-luxury-gold/20 text-luxury-cream pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-luxury-cream/60"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                  <p className="text-red-400 text-xs">Passwords do not match</p>
                )}
              </div>

              {error && (
                <Alert className="bg-red-900/20 border-red-500/50">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading || formData.password !== formData.confirmPassword}
                className="w-full bg-gradient-to-r from-luxury-gold to-luxury-gold/80 hover:from-luxury-gold/80 hover:to-luxury-gold text-black font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-luxury-cream/60">
            Already have an account?{' '}
            <a href="/login" className="text-luxury-gold hover:text-luxury-gold/80 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

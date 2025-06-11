
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Guest');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password || !confirmPassword || !role) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the provided N8N webhook URL
      const n8nWebhookUrl = 'https://minnewyorkofficial.app.n8n.cloud/webhook/auth/signup';
      
      // Send signup request to N8N webhook
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password, // N8N will handle hashing
          role,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
      
      toast.success('Account created successfully');
      
      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(message);
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 -rotate-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-0 rotate-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
          MiN NEW YORK
        </h1>
        <p className="text-gray-600">Create Your Luxury Management Account</p>
      </div>
      
      <LuxuryCard className="w-full max-w-md bg-white border border-gray-200 z-10 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display text-primary">Join The Team</h2>
          <p className="text-gray-600 text-sm mt-1">Register for platform access</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-gray-700">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="youremail@example.com"
                className="pl-10 w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-black focus:outline-none focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-gray-700">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-black focus:outline-none focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm text-gray-700">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-black focus:outline-none focus:border-primary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm text-gray-700">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger className="w-full bg-white border border-gray-300 text-black">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="CEO">CEO</SelectItem>
                <SelectItem value="CCO">CCO</SelectItem>
                <SelectItem value="Commercial Director">Commercial Director</SelectItem>
                <SelectItem value="GCC Regional Manager">GCC Regional Manager</SelectItem>
                <SelectItem value="Marketing Director">Marketing Director</SelectItem>
                <SelectItem value="Production Manager">Production Manager</SelectItem>
                <SelectItem value="Customer Support">Customer Support</SelectItem>
                <SelectItem value="Social Media Manager">Social Media Manager</SelectItem>
                <SelectItem value="Guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <LuxuryButton
            type="submit"
            className="w-full"
            gradient
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </LuxuryButton>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </LuxuryCard>
    </div>
  );
};

export default SignUp;

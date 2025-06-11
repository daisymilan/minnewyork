
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { VoiceCommandButton } from '@/components/Voice/VoiceCommandButton';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, voiceLogin, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [voiceDetectedRole, setVoiceDetectedRole] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn({ email, password, rememberMe });
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleVoiceCommand = async (command: string) => {
    const result = await voiceLogin({ voiceCommand: command });
    if (result.success && result.detectedRole) {
      setVoiceDetectedRole(result.detectedRole);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-sans font-bold text-foreground mb-2">
            MiN NEW YORK
          </h1>
          <p className="text-muted-foreground">Luxury Fragrance Management</p>
        </div>

        {/* Voice Authentication Card */}
        <Card className="bg-card border border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-card-foreground flex items-center justify-center space-x-2">
              <Mic className="w-5 h-5 text-primary" />
              <span>Voice Authentication</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              Say "Login as [Role]" to authenticate with voice
            </p>
            <VoiceCommandButton onCommand={handleVoiceCommand} disabled={isLoading} />
            {voiceDetectedRole && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Voice detected: {voiceDetectedRole}. Signing you in...
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Sign In Form */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-input border-border text-foreground pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember" className="text-card-foreground text-sm">
                  Remember me
                </Label>
              </div>

              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <a href="/signup" className="text-primary hover:text-primary/80 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

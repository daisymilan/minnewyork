
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
    <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-luxury-gold mb-2">
            MiN NEW YORK
          </h1>
          <p className="text-luxury-cream/60">Luxury Fragrance Management</p>
        </div>

        {/* Voice Authentication Card */}
        <Card className="bg-black/30 border border-luxury-gold/20">
          <CardHeader className="text-center">
            <CardTitle className="text-luxury-cream flex items-center justify-center space-x-2">
              <Mic className="w-5 h-5 text-luxury-gold" />
              <span>Voice Authentication</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-luxury-cream/60 text-sm">
              Say "Login as [Role]" to authenticate with voice
            </p>
            <VoiceCommandButton onCommand={handleVoiceCommand} disabled={isLoading} />
            {voiceDetectedRole && (
              <Alert className="bg-green-900/20 border-green-500/50">
                <AlertDescription className="text-green-400">
                  Voice detected: {voiceDetectedRole}. Signing you in...
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Sign In Form */}
        <Card className="bg-black/30 border border-luxury-gold/20">
          <CardHeader>
            <CardTitle className="text-luxury-cream text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-luxury-cream/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-black/30 border-luxury-gold/20 text-luxury-cream"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-luxury-cream/80">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember" className="text-luxury-cream/80 text-sm">
                  Remember me
                </Label>
              </div>

              {error && (
                <Alert className="bg-red-900/20 border-red-500/50">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold"
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
          <p className="text-luxury-cream/60">
            Don't have an account?{' '}
            <a href="/signup" className="text-luxury-gold hover:text-luxury-gold/80 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

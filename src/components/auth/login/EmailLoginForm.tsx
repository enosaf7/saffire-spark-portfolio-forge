
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, LogIn } from 'lucide-react';
import GoogleAuthButton from '../shared/GoogleAuthButton';

const EmailLoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(loginEmail, loginPassword);

      if (error) {
        toast.error(error.message || 'Login failed. Please try again.');
      } else {
        toast.success('Login successful!');
        // Redirection will be handled by the useEffect in AuthProvider
        if (loginEmail === 'enosaf7@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/booking');
        }
      }
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" /> Email
        </Label>
        <Input
          id="login-email"
          type="email"
          placeholder="your.email@example.com"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Password
          </Label>
          <button
            type="button"
            className="text-xs text-saffire-blue hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-saffire-blue hover:bg-saffire-darkBlue"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleAuthButton isLoading={isLoading} />
    </form>
  );
};

export default EmailLoginForm;

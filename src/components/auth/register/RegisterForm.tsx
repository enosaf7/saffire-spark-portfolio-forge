
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Lock, School } from 'lucide-react';
import GoogleAuthButton from '../shared/GoogleAuthButton';

const RegisterForm = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerUniversity, setRegisterUniversity] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validation
      if (registerPassword !== registerConfirmPassword) {
        toast.error('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Register with Supabase
      const { error } = await signUp(
        registerEmail, 
        registerPassword, 
        { 
          full_name: registerName,
          university: registerUniversity,
        }
      );
      
      if (error) {
        toast.error(error.message || 'Registration failed. Please try again.');
      } else {
        toast.success('Registration successful! Check your email for confirmation.');
        // Reset form
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
        setRegisterUniversity('');
      }
    } catch (error: any) {
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-name" className="flex items-center gap-2">
          <User className="h-4 w-4" /> Full Name
        </Label>
        <Input
          id="register-name"
          type="text"
          placeholder="John Doe"
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" /> Email
        </Label>
        <Input
          id="register-email"
          type="email"
          placeholder="your.email@example.com"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-university" className="flex items-center gap-2">
          <School className="h-4 w-4" /> University/Institution
        </Label>
        <Input
          id="register-university"
          type="text"
          placeholder="University or Institution (Optional)"
          value={registerUniversity}
          onChange={(e) => setRegisterUniversity(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" /> Password
        </Label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-confirm-password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" /> Confirm Password
        </Label>
        <Input
          id="register-confirm-password"
          type="password"
          placeholder="••••••••"
          value={registerConfirmPassword}
          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-saffire-blue hover:bg-saffire-darkBlue"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            Or sign up with
          </span>
        </div>
      </div>

      <GoogleAuthButton isLoading={isLoading} buttonText="Sign up with Google" />
    </form>
  );
};

export default RegisterForm;

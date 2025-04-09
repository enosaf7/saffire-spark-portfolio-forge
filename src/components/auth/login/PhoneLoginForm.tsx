
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Phone } from 'lucide-react';

const PhoneLoginForm = () => {
  const navigate = useNavigate();
  const { signInWithPhone, verifyOtp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (otpSent) {
        // Verify OTP
        const { error } = await verifyOtp(phoneNumber, otpCode);
        
        if (error) {
          toast.error(error.message || 'Invalid code. Please try again.');
        } else {
          toast.success('Phone verification successful!');
          navigate('/booking');
        }
      } else {
        // Send OTP
        const { error } = await signInWithPhone(phoneNumber);
        
        if (error) {
          toast.error(error.message || 'Failed to send verification code. Please try again.');
        } else {
          setOtpSent(true);
          toast.success('Verification code sent!');
        }
      }
    } catch (error: any) {
      toast.error(`Phone login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handlePhoneLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone-number" className="flex items-center gap-2">
          <Phone className="h-4 w-4" /> Phone Number
        </Label>
        <Input
          id="phone-number"
          type="tel"
          placeholder="+233 55 123 4567"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          disabled={otpSent}
        />
        <p className="text-xs text-muted-foreground">
          Enter your phone number with country code, e.g. +233 for Ghana
        </p>
      </div>

      {otpSent && (
        <div className="space-y-2">
          <Label htmlFor="otp-code">Verification Code</Label>
          <Input
            id="otp-code"
            type="text"
            inputMode="numeric"
            placeholder="123456"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Enter the code sent to your phone
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-saffire-blue hover:bg-saffire-darkBlue"
        disabled={isLoading}
      >
        {isLoading
          ? "Processing..."
          : otpSent
          ? "Verify Code"
          : "Send Verification Code"}
      </Button>

      {otpSent && (
        <Button
          type="button"
          variant="ghost"
          className="w-full text-saffire-blue"
          onClick={() => setOtpSent(false)}
          disabled={isLoading}
        >
          Change Phone Number
        </Button>
      )}
    </form>
  );
};

export default PhoneLoginForm;

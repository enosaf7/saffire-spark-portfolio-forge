
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import EmailLoginForm from './login/EmailLoginForm';
import PhoneLoginForm from './login/PhoneLoginForm';
import RegisterForm from './register/RegisterForm';

const AuthFormContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if user is already logged in
  if (user) {
    if (user.email === 'enosaf7@gmail.com') {
      navigate('/admin');
    } else {
      navigate('/booking');
    }
    return null;
  }

  const handleGuestAccess = () => {
    navigate('/booking?guest=true');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Choose your preferred method to access your account
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="login">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <EmailLoginForm />
            </TabsContent>
            
            <TabsContent value="phone">
              <PhoneLoginForm />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGuestAccess}
          >
            Continue as Guest
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthFormContainer;

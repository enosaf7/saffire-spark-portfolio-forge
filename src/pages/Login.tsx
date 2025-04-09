
import { useEffect } from 'react';
import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/ui/layout/Navbar";
import Footer from "@/components/ui/layout/Footer";
import { trackVisit } from "@/utils/visitorTracking";
import { Gem } from "lucide-react";
import { Helmet } from 'react-helmet';

const Login = () => {
  useEffect(() => {
    trackVisit('login');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Login | SaffireTech</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 text-3xl md:text-4xl font-bold">
                Sign In to 
                <span className="flex items-center text-saffire-blue">
                  <Gem className="h-8 w-8 mr-1" />
                  SaffireTech
                </span>
              </div>
            </div>
            <AuthForm />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;

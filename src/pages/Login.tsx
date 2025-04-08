
import { useEffect } from 'react';
import { Gem } from 'lucide-react';
import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/ui/layout/Navbar";
import Footer from "@/components/ui/layout/Footer";
import { trackVisit } from "@/utils/visitorTracking";

const Login = () => {
  useEffect(() => {
    trackVisit('login');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffire-blue to-saffire-purple flex items-center justify-center text-white">
                <Gem className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Sign In to <span className="text-saffire-blue">Saffire</span>Tech
            </h1>
            <AuthForm />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;


import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/ui/layout/Navbar";
import Footer from "@/components/ui/layout/Footer";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
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

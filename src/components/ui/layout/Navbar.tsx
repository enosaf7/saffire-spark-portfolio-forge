
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Menu, X, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Hide login button if already on login page
  const isLoginPage = location.pathname === '/login';
  
  return (
    <header className={`fixed w-full z-30 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/4ff9857f-ce94-49e9-887b-f0507f2d14ed.png" 
              alt="SaffireTech Logo" 
              className="h-10 w-10" 
            />
            <span className={`font-bold text-xl ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
              Saffire<span className="text-saffire-blue">Tech</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link to="/" className={`hover:text-saffire-blue ${isScrolled ? 'text-gray-700' : 'text-gray-700'}`}>Home</Link>
              <Link to="/booking" className={`hover:text-saffire-blue ${isScrolled ? 'text-gray-700' : 'text-gray-700'}`}>Services</Link>
              <Link to="/testimonials" className={`hover:text-saffire-blue ${isScrolled ? 'text-gray-700' : 'text-gray-700'}`}>Testimonials</Link>
              <Link to="/contact" className={`hover:text-saffire-blue ${isScrolled ? 'text-gray-700' : 'text-gray-700'}`}>Contact</Link>
            </nav>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={handleLogout} 
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              !isLoginPage && (
                <Link to="/login" className="flex">
                  <Button className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )
            )}
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              {isOpen ? (
                <X className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`} />
              )}
            </button>
          </div>
        </div>
        
        {isOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <nav className="flex flex-col space-y-3 px-4">
              <Link to="/" className="hover:text-saffire-blue" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/booking" className="hover:text-saffire-blue" onClick={() => setIsOpen(false)}>Services</Link>
              <Link to="/testimonials" className="hover:text-saffire-blue" onClick={() => setIsOpen(false)}>Testimonials</Link>
              <Link to="/contact" className="hover:text-saffire-blue" onClick={() => setIsOpen(false)}>Contact</Link>
              
              {user ? (
                <Button 
                  variant="ghost" 
                  onClick={() => { handleLogout(); setIsOpen(false); }} 
                  className="flex items-center gap-2 justify-start pl-0"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                !isLoginPage && (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

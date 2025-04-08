import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Phone, Gem } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, hasAdminAccess, signOut } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 w-full ${isScrolled ? 'bg-white bg-opacity-95 backdrop-blur-sm shadow-sm' : 'bg-white'} transition-all duration-300`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 z-10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffire-blue to-saffire-purple flex items-center justify-center text-white">
            <Gem className="h-6 w-6" />
          </div>
          <span className="font-heading font-bold text-xl text-saffire-darkGray">
            Saffire<span className="text-saffire-blue">Tech</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`font-medium transition-colors ${isActive('/') ? 'text-saffire-blue' : 'hover:text-saffire-blue'}`}
          >
            Home
          </Link>
          <Link 
            to="/booking" 
            className={`font-medium transition-colors ${isActive('/booking') ? 'text-saffire-blue' : 'hover:text-saffire-blue'}`}
          >
            Book Services
          </Link>
          <Link 
            to="/testimonials" 
            className={`font-medium transition-colors ${isActive('/testimonials') ? 'text-saffire-blue' : 'hover:text-saffire-blue'}`}
          >
            Testimonials
          </Link>
          <Link 
            to="/contact" 
            className={`font-medium transition-colors ${isActive('/contact') ? 'text-saffire-blue' : 'hover:text-saffire-blue'}`}
          >
            Contact
          </Link>
          {hasAdminAccess && (
            <Link 
              to="/admin" 
              className={`font-medium transition-colors ${isActive('/admin') ? 'text-saffire-purple' : 'text-saffire-purple/70 hover:text-saffire-purple'}`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-saffire-blue/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-saffire-blue" />
                </div>
                <span className="text-sm text-gray-600 hidden lg:inline">
                  {user.email}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-saffire-blue text-saffire-blue hover:bg-saffire-blue hover:text-white"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-saffire-blue text-saffire-blue hover:bg-saffire-blue hover:text-white">
                Sign In
              </Button>
            </Link>
          )}
          <Link to="/booking">
            <Button className="bg-saffire-blue hover:bg-saffire-darkBlue text-white">
              Book Now
            </Button>
          </Link>
        </div>

        <div className="flex md:hidden items-center space-x-3">
          <a 
            href="tel:0596760174" 
            className="bg-saffire-blue/10 text-saffire-blue p-2 rounded-full"
            aria-label="Call us"
          >
            <Phone className="h-5 w-5" />
          </a>
          <button 
            className="p-2 text-saffire-darkGray"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 md:hidden animate-slide-in-right">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-md transition-colors ${isActive('/') ? 'bg-saffire-lightBlue text-saffire-blue' : 'hover:bg-saffire-lightBlue'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/booking" 
                className={`px-4 py-2 rounded-md transition-colors ${isActive('/booking') ? 'bg-saffire-lightBlue text-saffire-blue' : 'hover:bg-saffire-lightBlue'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Book Services
              </Link>
              <Link 
                to="/testimonials" 
                className={`px-4 py-2 rounded-md transition-colors ${isActive('/testimonials') ? 'bg-saffire-lightBlue text-saffire-blue' : 'hover:bg-saffire-lightBlue'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link 
                to="/contact" 
                className={`px-4 py-2 rounded-md transition-colors ${isActive('/contact') ? 'bg-saffire-lightBlue text-saffire-blue' : 'hover:bg-saffire-lightBlue'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {hasAdminAccess && (
                <Link 
                  to="/admin" 
                  className={`px-4 py-2 rounded-md transition-colors ${isActive('/admin') ? 'bg-saffire-purple/20 text-saffire-purple' : 'bg-saffire-purple bg-opacity-10 text-saffire-purple'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              <div className="border-t border-gray-100 my-2 pt-2">
                {user ? (
                  <div className="space-y-3">
                    <div className="px-4 py-2 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-saffire-blue/10 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-saffire-blue" />
                      </div>
                      <span className="text-sm text-gray-600 truncate">
                        {user.email}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full border-saffire-blue text-saffire-blue"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    className="block w-full" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full border-saffire-blue text-saffire-blue">
                      Sign In
                    </Button>
                  </Link>
                )}
                
                <Link 
                  to="/booking"
                  className="block w-full mt-3" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full bg-saffire-blue text-white">
                    Book Now
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

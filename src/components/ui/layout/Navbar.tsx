
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white bg-opacity-95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffire-blue to-saffire-purple flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="font-heading font-bold text-xl text-saffire-darkGray">
            Saffire<span className="text-saffire-blue">Tech</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-saffire-blue transition-colors">
            Home
          </Link>
          <Link to="/booking" className="font-medium hover:text-saffire-blue transition-colors">
            Book Services
          </Link>
          <Link to="/contact" className="font-medium hover:text-saffire-blue transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline" className="border-saffire-blue text-saffire-blue hover:bg-saffire-blue hover:text-white">
              Sign In
            </Button>
          </Link>
          <Link to="/booking">
            <Button className="bg-saffire-blue hover:bg-saffire-darkBlue text-white">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden text-saffire-darkGray"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 md:hidden animate-slide-in-right">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="px-4 py-2 hover:bg-saffire-lightBlue rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/booking" 
                className="px-4 py-2 hover:bg-saffire-lightBlue rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Services
              </Link>
              <Link 
                to="/contact" 
                className="px-4 py-2 hover:bg-saffire-lightBlue rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/login" 
                className="px-4 py-2 hover:bg-saffire-lightBlue rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

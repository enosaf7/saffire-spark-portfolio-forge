
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffire-blue to-saffire-purple flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Saffire<span className="text-saffire-blue">Tech</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-xs">
              Professional CV writing and portfolio website development for university students.
            </p>
            <div className="pt-2">
              <p className="text-gray-400">© 2025 SaffireTech. All rights reserved.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-saffire-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-saffire-blue transition-colors">
                  Book Services
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-saffire-blue transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-saffire-blue transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <strong className="text-white">WhatsApp:</strong>{' '}
                <a 
                  href="https://wa.me/qr/YLDXJYXDR4LHA1" 
                  className="hover:text-saffire-blue transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Click to Chat
                </a>
              </li>
              <li className="text-gray-400">
                <strong className="text-white">Phone:</strong>{' '}
                <a 
                  href="tel:0596760174" 
                  className="hover:text-saffire-blue transition-colors"
                >
                  0596760174
                </a>
              </li>
              <li className="text-gray-400">
                <strong className="text-white">Email:</strong>{' '}
                <a 
                  href="mailto:enosaf7@gmail.com" 
                  className="hover:text-saffire-blue transition-colors"
                >
                  enosaf7@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

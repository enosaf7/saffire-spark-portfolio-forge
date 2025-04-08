
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Small setTimeout to ensure smoother loading experience
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-saffire-blue via-saffire-purple to-saffire-darkBlue text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')] bg-cover bg-center opacity-10"></div>
      
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 ${loaded ? 'opacity-100 transition-opacity duration-500' : 'opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Elevate Your Professional Identity with 
              <span className="relative">
                <span className="relative z-10"> Saffire</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-white opacity-20 -skew-x-3"></span>
              </span>
              <span>Tech</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-xl">
              Professional CV writing and portfolio website development tailored for university students. Stand out in the competitive job market.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/booking">
                <Button size="lg" className="bg-white text-saffire-blue hover:bg-gray-100 transition-colors">
                  Book Service <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/booking?guest=true">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Continue as Guest
                </Button>
              </Link>
            </div>
          </div>
          
          <div className={`flex justify-center ${loaded ? 'opacity-100 translate-y-0 transition-all duration-700' : 'opacity-0 translate-y-4'}`}>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 rounded-full bg-white opacity-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Student working on portfolio" 
                className="rounded-lg shadow-2xl w-full max-w-lg object-cover relative z-10"
                loading="eager"
              />
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-saffire-purple rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path 
            fill="#fff" 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;

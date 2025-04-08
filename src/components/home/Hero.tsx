
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Mark as loaded immediately since assets are optimized
    setLoaded(true);
  }, []);
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-saffire-blue via-saffire-purple to-saffire-darkBlue text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')] bg-cover bg-center opacity-10"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className={`lg:col-span-7 space-y-5 ${loaded ? 'opacity-100 transition-all duration-500' : 'opacity-0'}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">
              Elevate Your Professional Identity with 
              <span className="relative inline-block mx-2">
                <span className="relative z-10">Saffire</span>
                <span className="absolute bottom-1 left-0 w-full h-2 bg-white opacity-20 -skew-x-3"></span>
              </span>
              Tech
            </h1>
            <p className="text-lg text-gray-100 max-w-xl">
              Professional CV writing and portfolio website development tailored for university students. Stand out in the competitive job market.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/booking">
                <Button size="lg" className="bg-white text-saffire-blue hover:bg-gray-100 transition-colors shadow-lg">
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
          
          <div className={`lg:col-span-5 ${loaded ? 'opacity-100 translate-y-0 transition-all duration-500 delay-150' : 'opacity-0 translate-y-4'}`}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-48 h-48 rounded-full bg-white opacity-10 blur-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Student working on portfolio" 
                className="rounded-lg shadow-xl w-full object-cover relative z-10 aspect-video"
                loading="eager"
                width="600"
                height="400"
              />
              <div className="absolute -bottom-3 -right-3 w-32 h-32 bg-saffire-purple rounded-full opacity-30 blur-md"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider - Optimized SVG */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path 
            fill="#fff" 
            fillOpacity="1" 
            d="M0,32L48,37.3C96,43,192,53,288,69.3C384,85,480,107,576,101.3C672,96,768,64,864,58.7C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z">
          </path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;

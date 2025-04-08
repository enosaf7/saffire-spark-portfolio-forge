
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Testimonial, asTestimonials } from '@/types/supabase';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setTestimonials(asTestimonials(data || []));
      } catch (error) {
        console.error('Error loading testimonials:', error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('.testimonials-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [testimonials]);

  if (loading) {
    return (
      <section className="testimonials-section py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              What Our <span className="text-saffire-blue">Clients</span> Say
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saffire-blue"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="testimonials-section py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              What Our <span className="text-saffire-blue">Clients</span> Say
            </h2>
            <p className="text-gray-600">
              Be the first to share your experience with our services!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials-section py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold font-heading mb-4 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            What Our <span className="text-saffire-blue">Clients</span> Say
          </h2>
          <p className={`text-gray-600 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            Success stories from university students who have used our services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Desktop Testimonial Cards */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <Card 
                key={testimonial.id}
                className={`card-hover ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6">{testimonial.content}</p>
                  <div className="flex items-center">
                    <div className="bg-saffire-purple rounded-full p-2 mr-3">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-xs text-gray-500">{testimonial.program}, {testimonial.university}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Testimonial Carousel */}
          <div className="md:hidden">
            {testimonials.length > 0 && (
              <Card 
                key={testimonials[activeIndex].id}
                className="card-hover animate-fade-in"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-5 w-5 ${i < testimonials[activeIndex].stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6">{testimonials[activeIndex].content}</p>
                  <div className="flex items-center">
                    <div className="bg-saffire-purple rounded-full p-2 mr-3">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonials[activeIndex].name}</h4>
                      <p className="text-xs text-gray-500">
                        {testimonials[activeIndex].program}, {testimonials[activeIndex].university}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="flex justify-center mt-4 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full ${
                    activeIndex === index ? 'bg-saffire-blue' : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

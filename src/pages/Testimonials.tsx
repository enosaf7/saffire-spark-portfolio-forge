
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Testimonial, asTestimonials } from '@/types/supabase';
import Navbar from '@/components/ui/layout/Navbar';
import Footer from '@/components/ui/layout/Footer';
import TestimonialForm from '@/components/testimonials/TestimonialForm';
import { Card } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();

    // Set up a real-time subscription for testimonials
    const channel = supabase
      .channel('public:testimonials')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'testimonials',
        filter: 'approved=eq.true'
      }, (payload) => {
        console.log('Change received!', payload);
        fetchTestimonials();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              What Students Say About <span className="text-saffire-blue">Saffire</span>Tech
            </h1>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Read testimonials from students who have used our services to boost their academic and professional careers
            </p>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saffire-blue"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {testimonials.length > 0 ? (
                  testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="p-6 h-full flex flex-col">
                      <div className="flex items-center mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-5 w-5 ${
                              star <= testimonial.stars 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 italic mb-4 flex-grow">"{testimonial.content}"</p>
                      <div className="mt-auto">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.university}</p>
                        <p className="text-sm text-gray-500">{testimonial.program}</p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No testimonials available yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            )}
            
            {user && (
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Share Your Experience</h2>
                <TestimonialForm />
              </div>
            )}
            
            {!user && (
              <div className="text-center max-w-lg mx-auto p-6 bg-saffire-blue bg-opacity-5 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Want to share your experience?</h3>
                <p className="mb-4">Login to your account to leave a testimonial about our services.</p>
                <a href="/login" className="inline-block px-6 py-2 bg-saffire-blue text-white rounded-md hover:bg-saffire-darkBlue transition-colors">
                  Sign In to Leave a Review
                </a>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Testimonials;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Promotion, asPromotions } from '@/types/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('active', true)
          .or(`start_date.is.null,start_date.lte.${now}`)
          .or(`end_date.is.null,end_date.gt.${now}`)
          .order('priority', { ascending: false });

        if (error) {
          console.error('Error fetching promotions:', error);
          throw error;
        }
        
        setPromotions(asPromotions(data || []));
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (promotions.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {promo.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={promo.image_url} 
                    alt={promo.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2">{promo.title}</h3>
                <p className="text-gray-600 mb-4">{promo.description}</p>
                {promo.target_url && (
                  <Link to={promo.target_url.startsWith('http') ? promo.target_url : `/${promo.target_url}`}>
                    <Button className="w-full">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promotions;

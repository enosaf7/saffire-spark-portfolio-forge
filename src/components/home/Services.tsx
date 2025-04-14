
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const serviceData = [
  {
    id: 1,
    title: 'Professional CV Writing',
    description: 'Stand out with a professionally crafted CV that highlights your academic achievements and experience.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    features: [
      'ATS-Friendly Format',
      'Industry-Specific Keywords',
      'Highlight Academic Achievements',
      'Custom Design Options'
    ],
    value: 'cv'
  },
  {
    id: 2,
    title: 'Portfolio Website Development',
    description: 'Showcase your projects, skills and achievements with a beautiful, responsive portfolio website.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    features: [
      'Responsive Design',
      'Project Showcase',
      'Social Media Integration',
      'SEO Optimization'
    ],
    value: 'website'
  },
  {
    id: 3,
    title: 'Combo Package',
    description: 'Get both a professional CV and a portfolio website at a special bundle rate.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    features: [
      'Consistent Personal Branding',
      'CV Integration in Website',
      'Premium Design Options',
      'Extended Support'
    ],
    value: 'combo'
  }
];

const Services = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-id'));
            if (id && !visibleCards.includes(id)) {
              setVisibleCards(prev => [...prev, id]);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.service-card').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [visibleCards]);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Our <span className="text-saffire-blue">Services</span>
          </h2>
          <p className="text-gray-600">
            Tailored solutions to help university students showcase their talents and secure their dream opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceData.map((service) => (
            <Card 
              key={service.id}
              className={`service-card card-hover ${
                visibleCards.includes(service.id) ? 'animate-fade-in' : 'opacity-0'
              }`}
              data-id={service.id}
              style={{ animationDelay: `${(service.id - 1) * 0.2}s` }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-heading">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-saffire-blue flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link to={`/booking?service=${service.value}`} className="w-full">
                  <Button className="w-full bg-saffire-purple hover:bg-saffire-purple/90">
                    Book Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

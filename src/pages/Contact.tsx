
import { useState } from "react";
import Navbar from "@/components/ui/layout/Navbar";
import Footer from "@/components/ui/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, User, Mail, Clock, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Helmet } from 'react-helmet';
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'Contact Form Submission',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isMobile = useIsMobile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Call the contact-form edge function
      const { error } = await supabase.functions.invoke('contact-form', {
        body: formData
      });

      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Your message has been sent successfully!');
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', subject: 'Contact Form Submission' });
      
      // Reset submitted state after showing success message
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact SaffireTech | Professional CV & Portfolio Services</title>
        <meta name="description" content="Contact SaffireTech for professional CV writing and portfolio website development services." />
        <meta name="keywords" content="contact, CV writing, portfolio development" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Get in <span className="text-saffire-blue">Touch</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions or need more information? Reach out to us using any of the contact methods below.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Contact Form */}
              <Card className="shadow-lg transition-all hover:shadow-xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-saffire-blue" />
                    Send us a Message
                  </h2>
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            className="pl-10"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            aria-required="true"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            className="pl-10"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            aria-required="true"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Your Message <span className="text-red-500">*</span></Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="How can we help you?"
                          rows={5}
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          aria-required="true"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-saffire-blue hover:bg-saffire-darkBlue transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="bg-saffire-blue/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-saffire-blue" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
                      <p className="text-gray-600">
                        Thank you for reaching out. We'll get back to you shortly.
                      </p>
                      <Button 
                        className="mt-4 bg-saffire-blue hover:bg-saffire-darkBlue"
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-saffire-blue to-saffire-purple p-6 rounded-lg shadow-lg text-white">
                  <h2 className="text-xl font-semibold mb-4">Quick Response</h2>
                  <p className="mb-4">
                    Need an immediate response? Reach out to us directly:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone & WhatsApp</h3>
                        <p className="text-white/90">0596760174</p>
                        <a 
                          href="https://wa.me/qr/YLDXJYXDR4LHA1" 
                          className="text-white hover:underline text-sm inline-flex items-center" 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Chat on WhatsApp <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <a 
                          href="mailto:enosaf7@gmail.com" 
                          className="text-white/90 hover:text-white transition-colors inline-flex items-center"
                        >
                          enosaf7@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-saffire-purple" />
                    Business Hours
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-medium bg-saffire-blue/10 px-3 py-1 rounded-full text-saffire-blue text-sm">
                        9:00 AM - 6:00 PM
                      </span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium bg-red-100 px-3 py-1 rounded-full text-red-600 text-sm">
                        CLOSED
                      </span>
                    </li>
                    <li className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium bg-saffire-blue/10 px-3 py-1 rounded-full text-saffire-blue text-sm">
                        9:00 AM - 5:00 PM
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-saffire-purple p-5 rounded-lg shadow-lg text-white">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    Fast Response Guarantee
                  </h3>
                  <p className="text-white/90">
                    We aim to respond to all inquiries within 24 hours during business days. Your satisfaction is our priority!
                  </p>
                </div>

                {/* FAQ Section - Mobile Only */}
                {isMobile && (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
                    <h3 className="font-semibold text-lg mb-3">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-saffire-blue">How quickly can I get my CV?</h4>
                        <p className="text-gray-600 text-sm">Most CV projects are completed within 48-72 hours of booking.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-saffire-blue">Do you offer revisions?</h4>
                        <p className="text-gray-600 text-sm">Yes, we offer up to 3 free revisions on all CV projects.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Map or Additional Info - Optional */}
            <div className="mt-12 text-center">
              <h2 className="text-xl font-semibold mb-4">Service Areas</h2>
              <p className="text-gray-600 mb-2">
                We provide professional services throughout Ghana and beyond, with special focus on:
              </p>
              <div className="inline-flex flex-wrap justify-center gap-2 mt-2">
                {["Accra", "Kumasi", "Cape Coast", "Tamale", "Ho", "Koforidua", "International"].map((city) => (
                  <span key={city} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;

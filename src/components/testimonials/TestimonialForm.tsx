
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { StarIcon } from 'lucide-react';

const testimonialSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  university: z.string().min(2, { message: 'University is required' }),
  program: z.string().min(2, { message: 'Program is required' }),
  content: z.string().min(10, { message: 'Please provide more details in your review' }),
  stars: z.number().min(1).max(5)
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

const TestimonialForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: '',
      university: '',
      program: '',
      content: '',
      stars: 5
    },
  });

  const onSubmit = async (data: TestimonialFormValues) => {
    if (!user) {
      toast.error('Please log in to submit a testimonial');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Cast the table name explicitly to avoid type errors
      const { error } = await supabase
        .from('testimonials')
        .insert({
          user_id: user.id,
          name: data.name,
          university: data.university,
          program: data.program,
          content: data.content,
          stars: data.stars,
          approved: false // Default to false, admin will approve
        });
      
      if (error) throw error;
      
      toast.success('Thank you for your testimonial! It will be reviewed shortly.');
      form.reset();
      setSelectedRating(5);
    } catch (error: any) {
      toast.error('Error submitting testimonial: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    form.setValue('stars', rating);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Share Your Experience</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University</FormLabel>
                <FormControl>
                  <Input placeholder="University of Technology" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="program"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program/Course</FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stars"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleStarClick(rating)}
                        className="focus:outline-none"
                      >
                        <StarIcon
                          className={`h-6 w-6 ${
                            rating <= selectedRating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <input type="hidden" {...field} value={selectedRating} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Testimonial</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your experience with our services..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-saffire-blue hover:bg-saffire-darkBlue"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
          </Button>
        </form>
      </Form>
      
      <p className="text-sm text-gray-500 mt-4 text-center">
        Your testimonial will be reviewed before being published.
      </p>
    </div>
  );
};

export default TestimonialForm;


import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FileUp, Calendar } from 'lucide-react';

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isGuest = searchParams.get('guest') === 'true';
  const preselectedService = searchParams.get('service');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    program: '',
    serviceType: preselectedService || 'cv',
    tone: '',
    deadline: '',
    notes: '',
  });
  
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update service type if URL parameter changes
  useEffect(() => {
    if (preselectedService) {
      setFormData(prevData => ({
        ...prevData,
        serviceType: preselectedService
      }));
    }
  }, [preselectedService]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }
      setFileUploaded(true);
      setFileName(file.name);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.university || !formData.program || !formData.serviceType || !formData.deadline) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Your booking has been submitted successfully!');
      setIsSubmitting(false);
      navigate('/');
    }, 1500);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Book Our Services</CardTitle>
        <CardDescription>
          {isGuest 
            ? "You're booking as a guest. Create an account to track your orders." 
            : "Fill out the form below to request our services."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Your name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="university">University *</Label>
                <Input
                  id="university"
                  name="university"
                  placeholder="University of Technology"
                  value={formData.university}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">Program of Study *</Label>
                <Input
                  id="program"
                  name="program"
                  placeholder="e.g., Computer Science"
                  value={formData.program}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Service Type *</Label>
              <RadioGroup 
                value={formData.serviceType}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                onValueChange={(value) => handleSelectChange('serviceType', value)}
              >
                <div className={`flex items-center space-x-2 border rounded-md p-3 hover:border-saffire-blue cursor-pointer ${formData.serviceType === 'cv' ? 'border-saffire-blue bg-saffire-blue/5' : ''}`}>
                  <RadioGroupItem value="cv" id="cv" className="text-saffire-blue" />
                  <Label htmlFor="cv" className="cursor-pointer">CV Writing</Label>
                </div>
                <div className={`flex items-center space-x-2 border rounded-md p-3 hover:border-saffire-blue cursor-pointer ${formData.serviceType === 'website' ? 'border-saffire-blue bg-saffire-blue/5' : ''}`}>
                  <RadioGroupItem value="website" id="website" className="text-saffire-blue" />
                  <Label htmlFor="website" className="cursor-pointer">Portfolio Website</Label>
                </div>
                <div className={`flex items-center space-x-2 border rounded-md p-3 hover:border-saffire-blue cursor-pointer ${formData.serviceType === 'combo' ? 'border-saffire-blue bg-saffire-blue/5' : ''}`}>
                  <RadioGroupItem value="combo" id="combo" className="text-saffire-blue" />
                  <Label htmlFor="combo" className="cursor-pointer">Combo Package</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tone">Preferred Tone</Label>
              <Select onValueChange={(value) => handleSelectChange('tone', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="pl-10"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Upload Files (optional)</Label>
              <input
                type="file"
                id="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                  fileUploaded ? 'border-green-400 bg-green-50' : 'border-gray-300'
                }`}
                onClick={triggerFileInput}
              >
                <div className="flex flex-col items-center">
                  <FileUp className={`h-10 w-10 mb-2 ${fileUploaded ? 'text-green-500' : 'text-gray-400'}`} />
                  {fileUploaded ? (
                    <div>
                      <p className="text-green-600 font-medium">File uploaded successfully</p>
                      <p className="text-sm text-gray-500 mt-1">{fileName}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600">Click to upload your CV or project files</p>
                      <p className="text-xs text-gray-500 mt-1">PDF or Word documents (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any specific requirements or information you'd like us to know"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <CardFooter className="px-0 pt-4">
            <Button
              type="submit"
              className="w-full bg-saffire-blue hover:bg-saffire-darkBlue text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;

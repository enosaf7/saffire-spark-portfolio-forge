import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Testimonial, asTestimonials } from '@/types/supabase';

// Sample data for demonstration
const mockUsers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', university: 'University of Technology', joinDate: '2025-01-15' },
  { id: 2, name: 'David Chen', email: 'david.c@example.com', university: 'Metro State University', joinDate: '2025-02-03' },
  { id: 3, name: 'Maya Patel', email: 'maya.p@example.com', university: 'City College', joinDate: '2025-02-28' },
  { id: 4, name: 'James Wilson', email: 'james.w@example.com', university: 'Technical University', joinDate: '2025-03-10' },
];

const mockOrders = [
  { id: "ORD-001", customer: "Sarah Johnson", service: "CV Writing", status: "completed", deadline: "2025-03-15" },
  { id: "ORD-002", customer: "David Chen", service: "Portfolio Website", status: "in-progress", deadline: "2025-04-10" },
  { id: "ORD-003", customer: "Maya Patel", service: "Combo Package", status: "pending", deadline: "2025-04-20" },
  { id: "ORD-004", customer: "James Wilson", service: "CV Writing", status: "in-progress", deadline: "2025-04-05" },
];

const mockAnalytics = {
  visitors: 358,
  newUsers: 42,
  orders: {
    total: 27,
    pending: 8,
    inProgress: 12,
    completed: 7
  },
  conversionRate: '11.7%',
  popularService: 'CV Writing'
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user) {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      toast.error('You do not have permission to access this page');
      navigate('/');
      return;
    }

    // Fetch testimonials
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTestimonials(asTestimonials(data || []));
      } catch (error: any) {
        toast.error('Failed to load testimonials: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [user, isAdmin, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleApproveTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ approved: true })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setTestimonials(prevTestimonials => 
        prevTestimonials.map(testimonial => 
          testimonial.id === id ? {...testimonial, approved: true} : testimonial
        )
      );
      
      toast.success('Testimonial approved successfully');
    } catch (error: any) {
      toast.error('Failed to approve testimonial: ' + error.message);
    }
  };

  const handleRejectTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setTestimonials(prevTestimonials => 
        prevTestimonials.filter(testimonial => testimonial.id !== id)
      );
      
      toast.success('Testimonial rejected');
    } catch (error: any) {
      toast.error('Failed to reject testimonial: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-saffire-blue border-gray-200 mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffire-blue to-saffire-purple flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-heading font-bold text-xl">
              Saffire<span className="text-saffire-blue">Tech</span> <span className="text-sm font-normal">Admin</span>
            </span>
          </div>
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-saffire-blue">{mockAnalytics.visitors}</div>
              <p className="text-gray-600">Total Visitors</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-saffire-purple">{mockAnalytics.orders.total}</div>
              <p className="text-gray-600">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-saffire-blue">{mockUsers.length}</div>
              <p className="text-gray-600">Registered Users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-saffire-purple">{mockAnalytics.conversionRate}</div>
              <p className="text-gray-600">Conversion Rate</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="testimonials" className="space-y-6">
          <TabsList>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="testimonials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Testimonials Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">University</th>
                        <th className="px-4 py-2 text-left">Program</th>
                        <th className="px-4 py-2 text-left">Stars</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonials.length > 0 ? (
                        testimonials.map((testimonial) => (
                          <tr key={testimonial.id} className="border-t">
                            <td className="px-4 py-3">{testimonial.name}</td>
                            <td className="px-4 py-3">{testimonial.university}</td>
                            <td className="px-4 py-3">{testimonial.program}</td>
                            <td className="px-4 py-3">{testimonial.stars} ⭐</td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                testimonial.approved
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {testimonial.approved ? 'Approved' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-4 py-3 flex space-x-2">
                              {!testimonial.approved && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-green-50 text-green-700 hover:bg-green-100"
                                    onClick={() => handleApproveTestimonial(testimonial.id)}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-red-50 text-red-700 hover:bg-red-100"
                                    onClick={() => handleRejectTestimonial(testimonial.id)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {testimonial.approved && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="bg-red-50 text-red-700 hover:bg-red-100"
                                  onClick={() => handleRejectTestimonial(testimonial.id)}
                                >
                                  Remove
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                            No testimonials found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Order ID</th>
                        <th className="px-4 py-2 text-left">Customer</th>
                        <th className="px-4 py-2 text-left">Service</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Deadline</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map((order) => (
                        <tr key={order.id} className="border-t">
                          <td className="px-4 py-3">{order.id}</td>
                          <td className="px-4 py-3">{order.customer}</td>
                          <td className="px-4 py-3">{order.service}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              order.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : order.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status === 'completed' 
                                ? 'Completed' 
                                : order.status === 'in-progress'
                                ? 'In Progress'
                                : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3">{order.deadline}</td>
                          <td className="px-4 py-3">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">University</th>
                        <th className="px-4 py-2 text-left">Join Date</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="px-4 py-3">{user.name}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">{user.university}</td>
                          <td className="px-4 py-3">{user.joinDate}</td>
                          <td className="px-4 py-3">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">{mockAnalytics.orders.pending}</div>
                    <p className="text-gray-600">Pending</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{mockAnalytics.orders.inProgress}</div>
                    <p className="text-gray-600">In Progress</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{mockAnalytics.orders.completed}</div>
                    <p className="text-gray-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Service Popularity</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700">Most popular service: <strong>{mockAnalytics.popularService}</strong></p>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between">
                    <span>CV Writing</span>
                    <span>55%</span>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-saffire-blue rounded-full" style={{ width: '55%' }}></div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between">
                    <span>Portfolio Website</span>
                    <span>30%</span>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-saffire-purple rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between">
                    <span>Combo Package</span>
                    <span>15%</span>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-saffire-darkBlue rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;

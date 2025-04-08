import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Testimonial, 
  asTestimonials, 
  Profile, 
  asProfiles, 
  Order, 
  asOrders,
  asVisitors,
  Visitor,
  asUsers
} from '@/types/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VisitorsTab from '@/components/admin/VisitorsTab';
import PromotionsTab from '@/components/admin/PromotionsTab';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, hasAdminAccess, signOut } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [analytics, setAnalytics] = useState({
    visitors: 0,
    newUsers: 0,
    orders: {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0
    },
    conversionRate: '0%',
    popularService: ''
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user && !hasAdminAccess) {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }

    if (!isAdmin && !hasAdminAccess) {
      toast.error('You do not have permission to access this page');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch testimonials
        const { data: testimonialData, error: testimonialError } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });

        if (testimonialError) throw testimonialError;
        setTestimonials(asTestimonials(testimonialData || []));

        // Fetch users from our new users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (userError) throw userError;
        setUsers(asUsers(userData || []));
        
        // Fetch visitors count
        const { data: visitorData, error: visitorError } = await supabase
          .from('visitors')
          .select('*');
          
        if (visitorError) throw visitorError;
        const typedVisitors = asVisitors(visitorData || []);
        setVisitors(typedVisitors);

        try {
          // Try to fetch orders from the orders table
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
  
          if (orderError) throw orderError;
          
          const typedOrders = asOrders(orderData || []);
          setOrders(typedOrders);
          
          // Calculate analytics based on real data
          const total = typedOrders.length || 0;
          const pending = typedOrders.filter(order => order.status === 'pending').length || 0;
          const inProgress = typedOrders.filter(order => order.status === 'in-progress').length || 0;
          const completed = typedOrders.filter(order => order.status === 'completed').length || 0;
          
          // Find most popular service
          const services = typedOrders.map(order => order.service) || [];
          const serviceCounts: Record<string, number> = services.reduce((acc, service) => {
            acc[service] = (acc[service] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          const popularService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'CV Writing';
          
          setAnalytics({
            visitors: typedVisitors.length,
            newUsers: users.length,
            orders: {
              total,
              pending,
              inProgress,
              completed
            },
            conversionRate: typedVisitors.length > 0 ? `${((total / typedVisitors.length) * 100).toFixed(1)}%` : '0%',
            popularService
          });
        } catch (orderError) {
          console.error('Error fetching orders:', orderError);
          setOrders([]);
          
          // Set default analytics values if orders table doesn't exist yet
          setAnalytics({
            visitors: typedVisitors.length,
            newUsers: users.length,
            orders: {
              total: 0,
              pending: 0,
              inProgress: 0,
              completed: 0
            },
            conversionRate: '0%',
            popularService: 'CV Writing'
          });
        }
      } catch (error: any) {
        toast.error('Failed to load data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin, hasAdminAccess, navigate]);

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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffire-blue to-saffire-purple flex items-center justify-center text-white">
              <Gem className="h-6 w-6" />
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
              <div className="text-4xl font-bold text-saffire-blue">{analytics.visitors}</div>
              <p className="text-gray-600">Total Visitors</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-saffire-purple">{analytics.orders.total}</div>
              <p className="text-gray-600">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-saffire-blue">{users.length}</div>
              <p className="text-gray-600">Registered Users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-4xl font-bold text-saffire-purple">{analytics.conversionRate}</div>
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
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="testimonials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Testimonials Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Stars</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testimonials.length > 0 ? (
                        testimonials.map((testimonial) => (
                          <TableRow key={testimonial.id}>
                            <TableCell>{testimonial.name}</TableCell>
                            <TableCell>{testimonial.university}</TableCell>
                            <TableCell>{testimonial.program}</TableCell>
                            <TableCell>{testimonial.stars} ⭐</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                testimonial.approved
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {testimonial.approved ? 'Approved' : 'Pending'}
                              </span>
                            </TableCell>
                            <TableCell className="flex space-x-2">
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
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500">
                            No testimonials found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id.substring(0, 8)}</TableCell>
                            <TableCell>{order.customer_name}</TableCell>
                            <TableCell>{order.service}</TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>{new Date(order.deadline).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">View</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500">
                            No orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.full_name || 'No name'}</TableCell>
                            <TableCell>{user.email || 'No email'}</TableCell>
                            <TableCell>{user.university || 'Not specified'}</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role || 'User'}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">View</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
                    <div className="text-3xl font-bold text-yellow-600">{analytics.orders.pending}</div>
                    <p className="text-gray-600">Pending</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{analytics.orders.inProgress}</div>
                    <p className="text-gray-600">In Progress</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{analytics.orders.completed}</div>
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
                <p className="text-gray-700">Most popular service: <strong>{analytics.popularService}</strong></p>
                
                {analytics.popularService === 'CV Writing' && (
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between">
                      <span>CV Writing</span>
                      <span>55%</span>
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded-full">
                      <div className="h-full bg-saffire-blue rounded-full" style={{ width: '55%' }}></div>
                    </div>
                  </div>
                )}
                
                {analytics.popularService === 'Portfolio Website' && (
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between">
                      <span>Portfolio Website</span>
                      <span>30%</span>
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded-full">
                      <div className="h-full bg-saffire-purple rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                )}
                
                {analytics.popularService === 'Combo Package' && (
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between">
                      <span>Combo Package</span>
                      <span>15%</span>
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded-full">
                      <div className="h-full bg-saffire-darkBlue rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visitors">
            <VisitorsTab />
          </TabsContent>
          
          <TabsContent value="promotions">
            <PromotionsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;

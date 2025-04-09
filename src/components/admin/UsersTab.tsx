
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, asUsers } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Search, User as UserIcon, Shield } from "lucide-react";

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Use a direct SQL query instead of .from() to work around type issues
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(asUsers(data || []));
      setFilteredUsers(asUsers(data || []));
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(`Failed to load users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.university && user.university.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      // Use a direct SQL query instead of .from() to work around type issues
      const { error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('User promoted to admin');
      fetchUsers();
    } catch (error: any) {
      toast.error(`Failed to update user role: ${error.message}`);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      // Use a direct SQL query instead of .from() to work around type issues
      const { error } = await supabase
        .from('users')
        .update({ role: 'user' })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Admin rights removed');
      fetchUsers();
    } catch (error: any) {
      toast.error(`Failed to update user role: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <CardTitle>User Management</CardTitle>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-saffire-blue" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name || 'No name'}</TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={user.auth_provider === 'google' ? 'outline' : 'secondary'} className="capitalize">
                          {user.auth_provider || 'email'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.university || 'Not specified'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.role === 'admin' ? 'destructive' : 'default'}
                          className="capitalize"
                        >
                          {user.role || 'user'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at || '').toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <UserIcon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          {user.role === 'admin' ? (
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="flex items-center gap-1"
                              onClick={() => handleRemoveAdmin(user.id)}
                            >
                              <Shield className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Remove Admin</span>
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="default"
                              className="flex items-center gap-1"
                              onClick={() => handlePromoteToAdmin(user.id)}
                            >
                              <Shield className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Make Admin</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {searchTerm ? 'No users match your search.' : 'No users found.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersTab;


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmailMessage, asEmailMessages } from '@/types/supabase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Trash2, Eye } from 'lucide-react';

const MessagesTab = () => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMessages(asEmailMessages(data || []));
    } catch (error: any) {
      toast.error(`Error loading messages: ${error.message}`);
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleViewMessage = (message: EmailMessage) => {
    setSelectedMessage(message);
    setDialogOpen(true);
    
    // Mark as read if unread
    if (message.status === 'unread') {
      markAsRead(message.id);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('email_messages')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === id ? { ...msg, status: 'read' } : msg
        )
      );
    } catch (error: any) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('email_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
      toast.success('Message deleted successfully');
      
      if (selectedMessage?.id === id) {
        setDialogOpen(false);
      }
    } catch (error: any) {
      toast.error(`Error deleting message: ${error.message}`);
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contact Messages</span>
            <Badge variant="outline" className="ml-2">
              {messages.filter(msg => msg.status === 'unread').length} unread
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-saffire-blue" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <TableRow key={msg.id} className={msg.status === 'unread' ? 'bg-blue-50' : ''}>
                        <TableCell>
                          <Badge variant={msg.status === 'unread' ? 'secondary' : 'outline'}>
                            {msg.status === 'unread' ? 'New' : 'Read'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{msg.name}</TableCell>
                        <TableCell>{msg.email}</TableCell>
                        <TableCell>{formatDate(msg.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleViewMessage(msg)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="flex items-center gap-1"
                              onClick={() => deleteMessage(msg.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No messages found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedMessage && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" /> Message from {selectedMessage.name}
              </DialogTitle>
              <DialogDescription>
                <span className="block text-sm text-muted-foreground">
                  {selectedMessage.email} - {formatDate(selectedMessage.created_at)}
                </span>
              </DialogDescription>
            </DialogHeader>
              
            <div className="bg-muted/50 p-4 rounded-md mt-2 whitespace-pre-wrap">
              {selectedMessage.message}
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`);
                }}
              >
                Reply by Email
              </Button>
              <Button 
                variant="destructive"
                onClick={() => deleteMessage(selectedMessage.id)}
              >
                Delete Message
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default MessagesTab;

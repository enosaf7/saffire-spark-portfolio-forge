import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { EmailMessage, asEmailMessages } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Search, Mail, Trash2, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const MessagesTab = () => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedMessages = asEmailMessages(data || []);
      setMessages(typedMessages);
      setFilteredMessages(typedMessages);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error(`Failed to load messages: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter(message => 
        (message.name && message.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (message.email && message.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMessages(filtered);
    }
  }, [searchTerm, messages]);

  const handleViewMessage = (message: EmailMessage) => {
    setSelectedMessage(message);
    setOpenDialog(true);
    
    // If the message is unread, mark it as read
    if (message.status === 'unread') {
      updateMessageStatus(message.id, 'read');
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('email_messages')
        .update({ status })
        .eq('id', messageId);

      if (error) throw error;
      
      // Update local state
      setMessages(prev => 
        prev.map(m => m.id === messageId ? { ...m, status } : m)
      );
      setFilteredMessages(prev => 
        prev.map(m => m.id === messageId ? { ...m, status } : m)
      );
    } catch (error: any) {
      console.error('Error updating message status:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('email_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      toast.success('Message deleted');
      
      // Remove from local state
      setMessages(prev => prev.filter(m => m.id !== messageId));
      setFilteredMessages(prev => prev.filter(m => m.id !== messageId));
      
      // Close dialog if the deleted message was being viewed
      if (selectedMessage && selectedMessage.id === messageId) {
        setOpenDialog(false);
      }
    } catch (error: any) {
      toast.error(`Failed to delete message: ${error.message}`);
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
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((msg) => (
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
                              onClick={() => handleDeleteMessage(msg.id)}
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
                onClick={() => handleDeleteMessage(selectedMessage.id)}
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

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";
import { Promotion, asPromotions } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const PromotionsTab = () => {
  const { user } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<Partial<Promotion>>({
    title: '',
    description: '',
    image_url: '',
    target_url: '',
    active: true,
    priority: 0
  });
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(asPromotions(data || []));
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentPromotion(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentPromotion(prev => ({ ...prev, active: checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPromotion(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleOpenNewPromotionDialog = () => {
    setCurrentPromotion({
      title: '',
      description: '',
      image_url: '',
      target_url: '',
      active: true,
      priority: 0
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setCurrentPromotion(promotion);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    setPromotionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleActive = async (promotion: Promotion) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ active: !promotion.active })
        .eq('id', promotion.id);

      if (error) throw error;
      
      setPromotions(prevPromotions => 
        prevPromotions.map(p => 
          p.id === promotion.id ? { ...p, active: !p.active } : p
        )
      );
      
      toast.success(`Promotion ${!promotion.active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      toast.error('Failed to update promotion status');
    }
  };

  const handleSavePromotion = async () => {
    try {
      if (!currentPromotion.title || !currentPromotion.description) {
        toast.error('Title and description are required');
        return;
      }

      if (!user) {
        toast.error('You must be logged in to create promotions');
        return;
      }

      const promotionData = {
        title: currentPromotion.title!,
        description: currentPromotion.description!,
        created_by: user.id,
        image_url: currentPromotion.image_url || null,
        target_url: currentPromotion.target_url || null,
        active: currentPromotion.active === undefined ? true : currentPromotion.active,
        priority: currentPromotion.priority || 0
      };

      let error;

      if (isEditMode && currentPromotion.id) {
        const { error: updateError } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', currentPromotion.id);
          
        error = updateError;
        
        if (!updateError) {
          setPromotions(prevPromotions => 
            prevPromotions.map(p => 
              p.id === currentPromotion.id ? { ...p, ...promotionData } as Promotion : p
            )
          );
          toast.success('Promotion updated successfully');
        }
      } else {
        const { error: insertError } = await supabase
          .from('promotions')
          .insert(promotionData);
          
        error = insertError;
        
        if (!insertError) {
          await fetchPromotions();
          toast.success('Promotion created successfully');
        }
      }

      if (error) throw error;
      
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving promotion:', error);
      toast.error(`Failed to save promotion: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDeletePromotion = async () => {
    try {
      if (!promotionToDelete) return;
      
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionToDelete);

      if (error) throw error;
      
      setPromotions(prevPromotions => 
        prevPromotions.filter(p => p.id !== promotionToDelete)
      );
      
      toast.success('Promotion deleted successfully');
      setIsDeleteDialogOpen(false);
      setPromotionToDelete(null);
    } catch (error: any) {
      console.error('Error deleting promotion:', error);
      toast.error(`Failed to delete promotion: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-saffire-blue border-gray-200 mb-4"></div>
        <p className="text-gray-500">Loading promotions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Manage Promotions</h3>
        <Button onClick={handleOpenNewPromotionDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Promotion
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.length > 0 ? (
                  promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">{promotion.title}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          promotion.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {promotion.active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>{promotion.priority}</TableCell>
                      <TableCell>
                        {promotion.created_at 
                          ? new Date(promotion.created_at).toLocaleDateString() 
                          : 'Unknown'}
                      </TableCell>
                      <TableCell className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleActive(promotion)}
                          title={promotion.active ? 'Deactivate' : 'Activate'}
                        >
                          {promotion.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPromotion(promotion)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleOpenDeleteDialog(promotion.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No promotions found. Create one by clicking the "New Promotion" button.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Promotion' : 'New Promotion'}</DialogTitle>
            <DialogDescription>
              Create a promotion that will be displayed to users on the homepage.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title *
              </Label>
              <Input
                id="title"
                name="title"
                className="col-span-3"
                value={currentPromotion.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3"
                value={currentPromotion.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right">
                Image URL
              </Label>
              <Input
                id="image_url"
                name="image_url"
                className="col-span-3"
                value={currentPromotion.image_url || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target_url" className="text-right">
                Target URL
              </Label>
              <Input
                id="target_url"
                name="target_url"
                className="col-span-3"
                value={currentPromotion.target_url || ''}
                onChange={handleInputChange}
                placeholder="/booking or https://example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Input
                id="priority"
                name="priority"
                type="number"
                className="col-span-3"
                value={currentPromotion.priority || 0}
                onChange={handleNumberChange}
                min={0}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Active
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={currentPromotion.active === true}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="active">
                  {currentPromotion.active ? 'Yes' : 'No'}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePromotion}>
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this promotion? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePromotion}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionsTab;

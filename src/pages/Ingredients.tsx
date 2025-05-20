
import React, { useState } from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Ingredient } from '@/lib/types';

const Ingredients: React.FC = () => {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useKitchen();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState<Omit<Ingredient, 'id'>>({
    name: '',
    quantity: 0,
    unit: 'g',
    minimumQuantity: 0,
    deliveryDate: new Date().toISOString().split('T')[0]
  });
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIngredient(newIngredient);
    setNewIngredient({
      name: '',
      quantity: 0,
      unit: 'g',
      minimumQuantity: 0,
      deliveryDate: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIngredient) {
      updateIngredient(editingIngredient);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsEditDialogOpen(true);
  };

  const handleDeleteIngredient = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      deleteIngredient(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ingredients</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Ingredient</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ingredient Name</Label>
                <Input
                  id="name"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({...newIngredient, quantity: Number(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <select
                    id="unit"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value as any})}
                    required
                  >
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="l">Liters (l)</option>
                    <option value="piece">Pieces</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minimumQuantity">Minimum Quantity</Label>
                <Input
                  id="minimumQuantity"
                  type="number"
                  min="0"
                  value={newIngredient.minimumQuantity}
                  onChange={(e) => setNewIngredient({...newIngredient, minimumQuantity: Number(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={newIngredient.deliveryDate}
                  onChange={(e) => setNewIngredient({...newIngredient, deliveryDate: e.target.value})}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Add Ingredient</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ingredient</DialogTitle>
          </DialogHeader>
          {editingIngredient && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Ingredient Name</Label>
                <Input
                  id="edit-name"
                  value={editingIngredient.name}
                  onChange={(e) => setEditingIngredient({...editingIngredient, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="0"
                    value={editingIngredient.quantity}
                    onChange={(e) => setEditingIngredient({...editingIngredient, quantity: Number(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit">Unit</Label>
                  <select
                    id="edit-unit"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingIngredient.unit}
                    onChange={(e) => setEditingIngredient({...editingIngredient, unit: e.target.value as any})}
                    required
                  >
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="l">Liters (l)</option>
                    <option value="piece">Pieces</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-minimumQuantity">Minimum Quantity</Label>
                <Input
                  id="edit-minimumQuantity"
                  type="number"
                  min="0"
                  value={editingIngredient.minimumQuantity}
                  onChange={(e) => setEditingIngredient({...editingIngredient, minimumQuantity: Number(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-deliveryDate">Delivery Date</Label>
                <Input
                  id="edit-deliveryDate"
                  type="date"
                  value={editingIngredient.deliveryDate.split('T')[0]}
                  onChange={(e) => setEditingIngredient({...editingIngredient, deliveryDate: e.target.value})}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Update Ingredient</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Ingredients Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Minimum</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No ingredients found. Add some!
                </TableCell>
              </TableRow>
            ) : (
              ingredients.map(ingredient => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">{ingredient.name}</TableCell>
                  <TableCell>
                    {ingredient.quantity} {ingredient.unit}
                  </TableCell>
                  <TableCell>
                    {ingredient.minimumQuantity} {ingredient.unit}
                  </TableCell>
                  <TableCell>
                    {new Date(ingredient.deliveryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(ingredient)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteIngredient(ingredient.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Ingredients;


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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Minus } from 'lucide-react';
import { Meal, MealIngredient } from '@/lib/types';

const Meals: React.FC = () => {
  const { meals, ingredients, addMeal, updateMeal, deleteMeal, getPossiblePortions } = useKitchen();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newMeal, setNewMeal] = useState<Omit<Meal, 'id'>>({
    name: '',
    ingredients: [],
  });
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>('');
  const [selectedIngredientQuantity, setSelectedIngredientQuantity] = useState<number>(0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeal.ingredients.length === 0) {
      alert('Please add at least one ingredient to the meal.');
      return;
    }
    addMeal(newMeal);
    setNewMeal({
      name: '',
      ingredients: [],
    });
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMeal) {
      if (editingMeal.ingredients.length === 0) {
        alert('Please add at least one ingredient to the meal.');
        return;
      }
      updateMeal(editingMeal);
      setIsEditDialogOpen(false);
    }
  };

  const addIngredientToMeal = () => {
    if (!selectedIngredientId || selectedIngredientQuantity <= 0) {
      alert('Please select an ingredient and enter a valid quantity.');
      return;
    }

    const newIngredient: MealIngredient = {
      ingredientId: selectedIngredientId,
      quantity: selectedIngredientQuantity,
    };

    setNewMeal(prev => ({
      ...prev,
      ingredients: [...prev.ingredients.filter(i => i.ingredientId !== selectedIngredientId), newIngredient],
    }));

    setSelectedIngredientId('');
    setSelectedIngredientQuantity(0);
  };

  const addIngredientToEditingMeal = () => {
    if (!editingMeal || !selectedIngredientId || selectedIngredientQuantity <= 0) {
      alert('Please select an ingredient and enter a valid quantity.');
      return;
    }

    const newIngredient: MealIngredient = {
      ingredientId: selectedIngredientId,
      quantity: selectedIngredientQuantity,
    };

    setEditingMeal({
      ...editingMeal,
      ingredients: [...editingMeal.ingredients.filter(i => i.ingredientId !== selectedIngredientId), newIngredient],
    });

    setSelectedIngredientId('');
    setSelectedIngredientQuantity(0);
  };

  const removeIngredientFromMeal = (ingredientId: string) => {
    setNewMeal(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i.ingredientId !== ingredientId),
    }));
  };

  const removeIngredientFromEditingMeal = (ingredientId: string) => {
    if (!editingMeal) return;
    setEditingMeal({
      ...editingMeal,
      ingredients: editingMeal.ingredients.filter(i => i.ingredientId !== ingredientId),
    });
  };

  const openEditDialog = (meal: Meal) => {
    setEditingMeal(meal);
    setIsEditDialogOpen(true);
  };

  const handleDeleteMeal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      deleteMeal(id);
    }
  };

  const getIngredientName = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.name : 'Unknown Ingredient';
  };

  const getIngredientUnit = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.unit : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meals</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Meal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Meal Name</Label>
                <Input
                  id="name"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Ingredients</Label>
                <div className="flex space-x-2 mb-4">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedIngredientId}
                    onChange={(e) => setSelectedIngredientId(e.target.value)}
                  >
                    <option value="">Select an ingredient</option>
                    {ingredients.map(ingredient => (
                      <option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name} ({ingredient.quantity} {ingredient.unit} available)
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={selectedIngredientQuantity || ''}
                    onChange={(e) => setSelectedIngredientQuantity(Number(e.target.value))}
                    className="w-1/3"
                  />
                  <Button type="button" onClick={addIngredientToMeal}>
                    Add
                  </Button>
                </div>
                
                {newMeal.ingredients.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingredient</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newMeal.ingredients.map(ingredient => (
                        <TableRow key={ingredient.ingredientId}>
                          <TableCell>{getIngredientName(ingredient.ingredientId)}</TableCell>
                          <TableCell>{ingredient.quantity} {getIngredientUnit(ingredient.ingredientId)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIngredientFromMeal(ingredient.ingredientId)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No ingredients added yet. Please add at least one ingredient.
                  </div>
                )}
              </div>
              
              <Button type="submit" className="w-full">
                Add Meal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Meal</DialogTitle>
          </DialogHeader>
          {editingMeal && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Meal Name</Label>
                <Input
                  id="edit-name"
                  value={editingMeal.name}
                  onChange={(e) => setEditingMeal({...editingMeal, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Ingredients</Label>
                <div className="flex space-x-2 mb-4">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedIngredientId}
                    onChange={(e) => setSelectedIngredientId(e.target.value)}
                  >
                    <option value="">Select an ingredient</option>
                    {ingredients.map(ingredient => (
                      <option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name} ({ingredient.quantity} {ingredient.unit} available)
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={selectedIngredientQuantity || ''}
                    onChange={(e) => setSelectedIngredientQuantity(Number(e.target.value))}
                    className="w-1/3"
                  />
                  <Button type="button" onClick={addIngredientToEditingMeal}>
                    Add
                  </Button>
                </div>
                
                {editingMeal.ingredients.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingredient</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editingMeal.ingredients.map(ingredient => (
                        <TableRow key={ingredient.ingredientId}>
                          <TableCell>{getIngredientName(ingredient.ingredientId)}</TableCell>
                          <TableCell>{ingredient.quantity} {getIngredientUnit(ingredient.ingredientId)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIngredientFromEditingMeal(ingredient.ingredientId)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No ingredients added yet. Please add at least one ingredient.
                  </div>
                )}
              </div>
              
              <Button type="submit" className="w-full">
                Update Meal
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Meals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No meals found. Add some!
          </div>
        ) : (
          meals.map(meal => {
            const possiblePortions = getPossiblePortions(meal);
            
            return (
              <Card key={meal.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{meal.name}</h3>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(meal)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMeal(meal.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-muted-foreground">
                        Possible portions: <span className="font-medium">{possiblePortions}</span>
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-medium mb-2">Ingredients:</h4>
                    <ul className="space-y-1">
                      {meal.ingredients.map(ingredient => (
                        <li key={ingredient.ingredientId} className="text-sm flex justify-between">
                          <span>{getIngredientName(ingredient.ingredientId)}</span>
                          <span className="text-muted-foreground">
                            {ingredient.quantity} {getIngredientUnit(ingredient.ingredientId)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Meals;

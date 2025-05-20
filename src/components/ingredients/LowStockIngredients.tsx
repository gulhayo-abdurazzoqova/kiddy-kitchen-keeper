
import React from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const LowStockIngredients: React.FC = () => {
  const { ingredients } = useKitchen();
  
  const lowStockItems = ingredients
    .filter(i => i.quantity < i.minimumQuantity)
    .sort((a, b) => {
      // Sort by percentage of minimum stock (lowest first)
      const aPercentage = (a.quantity / a.minimumQuantity) * 100;
      const bPercentage = (b.quantity / b.minimumQuantity) * 100;
      return aPercentage - bPercentage;
    });
  
  if (lowStockItems.length === 0) {
    return <p className="text-muted-foreground">No ingredients below minimum stock level.</p>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ingredient</TableHead>
          <TableHead>Current Stock</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lowStockItems.map(ingredient => {
          const stockPercentage = Math.round((ingredient.quantity / ingredient.minimumQuantity) * 100);
          
          return (
            <TableRow key={ingredient.id}>
              <TableCell className="font-medium">{ingredient.name}</TableCell>
              <TableCell>
                {ingredient.quantity} {ingredient.unit} 
                <span className="text-xs text-muted-foreground ml-1">
                  (min: {ingredient.minimumQuantity} {ingredient.unit})
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={stockPercentage} className="h-2" />
                  <span className="text-xs font-medium">{stockPercentage}%</span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default LowStockIngredients;

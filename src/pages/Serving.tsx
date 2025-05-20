
import React, { useState } from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Serving: React.FC = () => {
  const { meals, getPossiblePortions, serveMeal, servingEvents } = useKitchen();
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [portionsCount, setPortionsCount] = useState<number>(1);
  
  const handleServeMeal = () => {
    if (!selectedMeal) {
      alert('Please select a meal to serve.');
      return;
    }
    
    const success = serveMeal(selectedMeal, portionsCount);
    if (success) {
      setSelectedMeal('');
      setPortionsCount(1);
    }
  };
  
  // Sort events with most recent first
  const sortedEvents = [...servingEvents].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const getMealName = (mealId: string) => {
    const meal = meals.find(m => m.id === mealId);
    return meal ? meal.name : 'Unknown Meal';
  };
  
  const selectedMealObj = selectedMeal ? meals.find(m => m.id === selectedMeal) : null;
  const possiblePortions = selectedMealObj ? getPossiblePortions(selectedMealObj) : 0;
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Serve Meals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Serve a Meal</CardTitle>
            <CardDescription>Select a meal and specify how many portions to serve</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meal">Select Meal</Label>
                <select
                  id="meal"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedMeal}
                  onChange={(e) => setSelectedMeal(e.target.value)}
                >
                  <option value="">Choose a meal</option>
                  {meals.map(meal => {
                    const portions = getPossiblePortions(meal);
                    return (
                      <option key={meal.id} value={meal.id} disabled={portions === 0}>
                        {meal.name} ({portions} portions possible)
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="portions">Number of Portions</Label>
                <Input
                  id="portions"
                  type="number"
                  min="1"
                  max={possiblePortions}
                  value={portionsCount}
                  onChange={(e) => setPortionsCount(Number(e.target.value))}
                  disabled={!selectedMeal || possiblePortions === 0}
                />
                {selectedMeal && (
                  <p className="text-xs text-muted-foreground">
                    Maximum available: {possiblePortions} portions
                  </p>
                )}
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleServeMeal}
                disabled={!selectedMeal || portionsCount < 1 || portionsCount > possiblePortions}
              >
                Serve Meal
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Serving History</CardTitle>
            <CardDescription>
              List of recently served meals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meal</TableHead>
                  <TableHead>Portions</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      No serving records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedEvents.map(event => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {getMealName(event.mealId)}
                      </TableCell>
                      <TableCell>
                        {event.portionsServed} portions
                      </TableCell>
                      <TableCell>
                        {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Serving;

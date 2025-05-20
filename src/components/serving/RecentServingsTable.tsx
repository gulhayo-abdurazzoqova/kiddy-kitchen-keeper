
import React from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockUsers } from '@/lib/mockData';

const RecentServingsTable: React.FC = () => {
  const { servingEvents, meals } = useKitchen();
  
  const recentEvents = [...servingEvents]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const getMealName = (mealId: string) => {
    const meal = meals.find(m => m.id === mealId);
    return meal ? meal.name : 'Unknown Meal';
  };
  
  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  if (recentEvents.length === 0) {
    return <p className="text-muted-foreground">No serving events recorded yet.</p>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Meal</TableHead>
          <TableHead>Portions</TableHead>
          <TableHead>Served By</TableHead>
          <TableHead>Date & Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentEvents.map(event => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{getMealName(event.mealId)}</TableCell>
            <TableCell>{event.portionsServed}</TableCell>
            <TableCell>{getUserName(event.userId)}</TableCell>
            <TableCell>
              {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentServingsTable;

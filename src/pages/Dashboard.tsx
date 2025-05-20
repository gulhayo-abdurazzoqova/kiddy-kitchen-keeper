
import React from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Utensils, ShoppingBasket, ClipboardList, AlertTriangle } from 'lucide-react';
import RecentServingsTable from '@/components/serving/RecentServingsTable';
import LowStockIngredients from '@/components/ingredients/LowStockIngredients';

const Dashboard: React.FC = () => {
  const { 
    ingredients, 
    meals, 
    servingEvents,
    alerts
  } = useKitchen();
  
  const lowStockItems = ingredients.filter(
    i => i.quantity < i.minimumQuantity
  ).length;
  
  const totalPortionsServed = servingEvents.reduce(
    (sum, event) => sum + event.portionsServed, 
    0
  );
  
  const unreadMisuseAlerts = alerts.filter(
    a => a.type === 'potential_misuse' && !a.read
  );
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Ingredients
              </CardTitle>
            </div>
            <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingredients.length}</div>
            {lowStockItems > 0 && (
              <p className="text-xs text-destructive mt-1">
                {lowStockItems} items below minimum stock
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Meals
              </CardTitle>
            </div>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meals.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portions Served
              </CardTitle>
            </div>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPortionsServed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alerts
              </CardTitle>
            </div>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.filter(a => !a.read).length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unread notifications
            </p>
          </CardContent>
        </Card>
      </div>
      
      {unreadMisuseAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Potential Misuse Detected</AlertTitle>
          <AlertDescription>
            There are {unreadMisuseAlerts.length} unresolved alerts about potential inventory misuse.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Low Stock Ingredients</CardTitle>
            <CardDescription>
              Ingredients that are below minimum stock level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LowStockIngredients />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Servings</CardTitle>
            <CardDescription>
              Latest meals that have been served
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentServingsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

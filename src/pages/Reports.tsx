
import React from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const Reports: React.FC = () => {
  const { reports, servingEvents, meals, ingredients } = useKitchen();
  
  // Data for ingredients consumption chart
  const ingredientsUsageData = ingredients.map(ingredient => {
    // Calculate total used
    let totalUsed = 0;
    
    servingEvents.forEach(event => {
      const meal = meals.find(m => m.id === event.mealId);
      if (meal) {
        const mealIngredient = meal.ingredients.find(i => i.ingredientId === ingredient.id);
        if (mealIngredient) {
          totalUsed += mealIngredient.quantity * event.portionsServed;
        }
      }
    });
    
    return {
      name: ingredient.name,
      current: ingredient.quantity,
      used: totalUsed,
      unit: ingredient.unit
    };
  });
  
  const hasMisuseReport = reports.some(report => report.differencePercentage > 15);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports & Analytics</h1>
      
      {hasMisuseReport && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Potential Inventory Misuse Detected</AlertTitle>
          <AlertDescription>
            Some monthly reports show a significant discrepancy between prepared portions and possible portions.
            This may indicate potential inventory misuse or accounting errors.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingredient Usage</CardTitle>
            <CardDescription>
              Current stock and used quantities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={{}} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ingredientsUsageData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background p-2 rounded shadow border">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-xs">Current Stock: {data.current} {data.unit}</p>
                              <p className="text-xs">Used: {data.used} {data.unit}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="current" fill="#8884d8" name="Current Stock" />
                    <Bar dataKey="used" fill="#82ca9d" name="Used" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Reports</CardTitle>
            <CardDescription>
              Report of portions served vs possible portions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Served</TableHead>
                  <TableHead>Possible</TableHead>
                  <TableHead>Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No reports available yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map(report => (
                    <TableRow key={report.month}>
                      <TableCell className="font-medium">
                        {new Date(report.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </TableCell>
                      <TableCell>{report.portionsServed}</TableCell>
                      <TableCell>{report.possiblePortions}</TableCell>
                      <TableCell>
                        <span 
                          className={`font-medium ${
                            report.differencePercentage > 15 
                              ? 'text-destructive' 
                              : report.differencePercentage > 10 
                                ? 'text-amber-600' 
                                : ''
                          }`}
                        >
                          {report.differencePercentage}%
                          {report.differencePercentage > 15 && 
                            ' ⚠️'
                          }
                        </span>
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

export default Reports;

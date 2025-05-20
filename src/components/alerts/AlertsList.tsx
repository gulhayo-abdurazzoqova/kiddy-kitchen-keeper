
import React from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShoppingBasket, CheckCircle } from 'lucide-react';

const AlertsList: React.FC = () => {
  const { alerts, markAlertAsRead } = useKitchen();
  
  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
        <h2 className="text-lg font-medium">All Clear!</h2>
        <p className="text-muted-foreground">No alerts to display.</p>
      </div>
    );
  }
  
  // Sort alerts with unread first, then by date (newest first)
  const sortedAlerts = [...alerts].sort((a, b) => {
    // Unread alerts come first
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    // Then sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
      {sortedAlerts.map(alert => (
        <div 
          key={alert.id} 
          className={`p-4 rounded-md border ${
            alert.read ? 'bg-background' : 'bg-muted'
          } ${
            alert.type === 'potential_misuse' ? 'border-destructive/50' : 'border-border'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`rounded-full p-2 ${
              alert.type === 'potential_misuse' 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-amber-100 text-amber-600'
            }`}>
              {alert.type === 'potential_misuse' ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <ShoppingBasket className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-medium ${
                  alert.type === 'potential_misuse' ? 'text-destructive' : ''
                }`}>
                  {alert.type === 'potential_misuse' ? 'Potential Misuse' : 'Low Stock Alert'}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {new Date(alert.date).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm">{alert.message}</p>
              {!alert.read && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2" 
                  onClick={() => markAlertAsRead(alert.id)}
                >
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertsList;

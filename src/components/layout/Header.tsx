
import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useKitchen } from '@/contexts/KitchenContext';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AlertsList from '@/components/alerts/AlertsList';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { alerts } = useKitchen();
  
  const unreadAlerts = alerts.filter(alert => !alert.read);
  
  return (
    <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold">Kindergarten Kitchen Management</h1>
      
      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {unreadAlerts.length}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alerts & Notifications</DialogTitle>
            </DialogHeader>
            <AlertsList />
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-2">
          <span className="text-sm">
            {user?.name} ({user?.role})
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

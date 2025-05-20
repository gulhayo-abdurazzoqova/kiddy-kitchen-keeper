
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/lib/mockData';

const Login: React.FC = () => {
  const { login } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card border rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Kindergarten Kitchen Management</h1>
          <p className="text-muted-foreground mt-2">Please log in to continue</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Available Users</h2>
          <div className="space-y-2">
            {mockUsers.map((user) => (
              <Button
                key={user.id}
                className="w-full justify-start"
                variant="outline"
                onClick={() => login(user.id)}
              >
                <span className="flex-1 text-left">{user.name}</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-muted">
                  {user.role}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

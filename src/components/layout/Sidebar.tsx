
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  ShoppingBasket, 
  Utensils, 
  ClipboardList, 
  BarChart,
  Users
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isAllowed } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { 
      path: '/', 
      name: 'Dashboard', 
      icon: <Home className="h-5 w-5 mr-2" />,
      allowedRoles: ['admin', 'cook', 'manager'] 
    },
    { 
      path: '/ingredients', 
      name: 'Ingredients', 
      icon: <ShoppingBasket className="h-5 w-5 mr-2" />,
      allowedRoles: ['admin', 'manager'] 
    },
    { 
      path: '/meals', 
      name: 'Meals', 
      icon: <Utensils className="h-5 w-5 mr-2" />,
      allowedRoles: ['admin', 'cook', 'manager'] 
    },
    { 
      path: '/serving', 
      name: 'Serving', 
      icon: <ClipboardList className="h-5 w-5 mr-2" />,
      allowedRoles: ['admin', 'cook'] 
    },
    { 
      path: '/reports', 
      name: 'Reports', 
      icon: <BarChart className="h-5 w-5 mr-2" />,
      allowedRoles: ['admin', 'manager'] 
    },
    { 
      path: '/users', 
      name: 'Users', 
      icon: <Users className="h-5 w-5 mr-2" />,
      allowedRoles: ['admin'] 
    }
  ];
  
  return (
    <aside className="w-64 bg-sidebar border-r h-full">
      <nav className="py-4">
        <ul>
          {navItems.map((item) => (
            isAllowed(item.allowedRoles) && (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 hover:bg-sidebar-accent ${
                    isActive(item.path) 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                      : 'text-sidebar-foreground'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            )
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

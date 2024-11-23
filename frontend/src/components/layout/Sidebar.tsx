import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Box, 
  Settings,
  PackageOpen,
  BarChart2
} from 'lucide-react';

interface MenuItem {
  path: string;
  icon: React.FC<{ className?: string }>;
  label: string;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { 
      path: '/', 
      icon: LayoutDashboard, 
      label: 'Dashboard' 
    },
    { 
      path: '/production', 
      icon: BarChart2, 
      label: 'Production' 
    },
    { 
      path: '/boxes', 
      icon: Box, 
      label: 'Box Management' 
    },
    { 
      path: '/inventory', 
      icon: PackageOpen, 
      label: 'Inventory' 
    },
    { 
      path: '/settings', 
      icon: Settings, 
      label: 'Settings' 
    }
  ];

  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed">
      <div className="p-6">
        <h1 className="text-xl font-bold">Production System</h1>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 
                hover:text-white transition-colors duration-200
                ${isActive ? 'bg-gray-700 text-white' : ''}
              `}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-6">
        <div className="border-t border-gray-700 pt-4">
          <div className="text-sm text-gray-400">
            <div>Version 1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

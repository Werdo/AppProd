import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Clock } from '../shared/Clock';
import { 
  UserCircle, 
  LogOut, 
  Bell 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-4">
          <Clock 
            format24Hour={true} 
            showSeconds={true} 
            className="text-gray-700 text-xl"
          />
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-gray-900">
            <Bell className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserCircle className="h-8 w-8 text-gray-600" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user?.name || 'Usuario'}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.role || 'Operator'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-md 
                text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

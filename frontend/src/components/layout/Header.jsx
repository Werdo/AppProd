import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, Bell } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = React.useState([]);

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-400 lg:hidden hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 lg:ml-0">
              <h1 className="text-xl font-bold text-gray-900">
                Production System
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
                <Bell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
            </div>

            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
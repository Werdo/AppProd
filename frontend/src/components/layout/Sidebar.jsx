import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  QrCode, 
  Box, 
  Printer, 
  FileText,
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'Device Registration', icon: QrCode, href: '/devices' },
    { name: 'Boxing Process', icon: Box, href: '/boxing' },
    { name: 'Print Labels', icon: Printer, href: '/print' },
    { name: 'Reports', icon: FileText, href: '/reports' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )
                }
              >
                <item.icon
                  className="mr-3 h-6 w-6 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
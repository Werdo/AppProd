import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const NotificationCenter = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  React.useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/notifications');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addNotification({
        id: Date.now(),
        ...data
      });
    };

    return () => ws.close();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <div className="p-4">
              <h3 className="text-lg font-medium">Notifications</h3>
              <div className="mt-4 space-y-2">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="text-sm font-medium">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
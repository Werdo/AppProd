import React from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card } from '@/components/common';
import { 
  ProductionStats,
  ActiveOrders,
  RecentActivity
} from '@/components/features/dashboard';

const Dashboard = () => {
  const [stats, setStats] = React.useState({
    totalDevices: 0,
    completedBoxes: 0,
    activeOrders: 0,
    printerStatus: 'online'
  });

  const { subscribe } = useWebSocket('ws://localhost:8000/ws/dashboard');

  React.useEffect(() => {
    subscribe((data) => {
      if (data.type === 'stats_update') {
        setStats(prev => ({ ...prev, ...data.stats }));
      }
    });
  }, [subscribe]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">
              Total Devices
            </h3>
            <p className="text-3xl font-bold text-primary-600">
              {stats.totalDevices}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">
              Completed Boxes
            </h3>
            <p className="text-3xl font-bold text-primary-600">
              {stats.completedBoxes}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">
              Active Orders
            </h3>
            <p className="text-3xl font-bold text-primary-600">
              {stats.activeOrders}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">
              Printer Status
            </h3>
            <p className={`text-3xl font-bold ${
              stats.printerStatus === 'online' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {stats.printerStatus}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductionStats />
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
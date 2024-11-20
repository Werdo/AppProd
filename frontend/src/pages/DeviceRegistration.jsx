import React from 'react';
import { useApi } from '@/hooks/useApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { QrReader } from '@/components/QrReader';
import { 
  DeviceList,
  OrderInfo,
  ScannerControls 
} from '@/components/features/devices';

const DeviceRegistration = () => {
  const [devices, setDevices] = React.useState([]);
  const [currentOrder, setCurrentOrder] = React.useState(null);
  const [scanning, setScanning] = React.useState(true);
  const { request, loading, error } = useApi();
  const { subscribe } = useWebSocket('ws://localhost:8000/ws/devices');

  React.useEffect(() => {
    subscribe((data) => {
      if (data.type === 'device_registered') {
        setDevices(prev => [...prev, data.device]);
      }
    });
  }, [subscribe]);

  const handleScan = async (data) => {
    if (data && currentOrder) {
      try {
        const result = await request('POST', '/api/v1/devices', {
          qr_code: data,
          order_id: currentOrder.id
        });
        setDevices(prev => [...prev, result]);
      } catch (err) {
        console.error('Error registering device:', err);
      }
    }
  };

  const handleOrderSelect = async (orderId) => {
    try {
      const order = await request('GET', `/api/v1/orders/${orderId}`);
      setCurrentOrder(order);
    } catch (err) {
      console.error('Error fetching order:', err);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-6 p-6">
      {/* Order Info Panel (20%) */}
      <div className="col-span-1">
        <OrderInfo
          order={currentOrder}
          onOrderSelect={handleOrderSelect}
          totalDevices={devices.length}
        />
      </div>

      {/* Main Work Area (80%) */}
      <div className="col-span-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Scanner Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Device Scanner</h2>
            {scanning ? (
              <QrReader onScan={handleScan} />
            ) : (
              <ScannerControls onStart={() => setScanning(true)} />
            )}
          </div>

          {/* Device List Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Scans</h2>
            <DeviceList devices={devices} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceRegistration;
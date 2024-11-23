import React from 'react';
import { useApi } from '../hooks/useApi';
import { useWebSocket } from '../hooks/useWebSocket';
import { Card, Button } from '../components/common';
import { QrReader } from '../components/QrReader';

const BoxingProcess = () => {
  const [currentBox, setCurrentBox] = React.useState(null);
  const [devices, setDevices] = React.useState([]);
  const { request } = useApi();
  const { subscribe } = useWebSocket();

  React.useEffect(() => {
    const unsubscribe = subscribe(message => {
      if (message.type === 'DEVICE_ADDED') {
        setDevices(prev => [...prev, message.device]);
      }
    });

    return () => unsubscribe();
  }, [subscribe]);

  const handleScan = async (data) => {
    if (!currentBox || !data) return;

    try {
      await request('POST', `/boxes/${currentBox.id}/devices`, {
        device_id: data
      });
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  const createNewBox = async () => {
    try {
      const response = await request('POST', '/boxes');
      setCurrentBox(response.data);
    } catch (error) {
      console.error('Error creating box:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Box Control</h2>
        {currentBox ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Box ID: {currentBox.id}</p>
                <p className="text-sm text-gray-500">
                  Devices: {devices.length}/24
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setCurrentBox(null)}
              >
                Close Box
              </Button>
            </div>
            <QrReader onScan={handleScan} />
          </div>
        ) : (
          <Button onClick={createNewBox}>
            Create New Box
          </Button>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Scanned Devices</h2>
        <div className="space-y-2">
          {devices.map((device, index) => (
            <div
              key={device.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <span>{index + 1}. {device.imei}</span>
              <span className="text-gray-500">{device.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default BoxingProcess;
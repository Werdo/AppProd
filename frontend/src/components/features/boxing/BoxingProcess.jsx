import React from 'react';
import { useApi } from '@/hooks/useApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { QrReader } from '@/components/QrReader';
import { Button, Card } from '@/components/common';

const BoxingProcess = () => {
  const [currentBox, setCurrentBox] = React.useState(null);
  const [devices, setDevices] = React.useState([]);
  const { request } = useApi();
  const { subscribe } = useWebSocket('ws://localhost:8000/ws/boxing');

  React.useEffect(() => {
    subscribe((data) => {
      if (data.type === 'box_update') {
        setDevices(data.devices);
      }
    });
  }, [subscribe]);

  const createNewBox = async () => {
    try {
      const response = await request('POST', '/api/v1/boxes/export');
      setCurrentBox(response.data);
    } catch (err) {
      console.error('Error creating box:', err);
    }
  };

  const handleDeviceScan = async (qrData) => {
    if (!currentBox) return;

    try {
      await request('POST', `/api/v1/boxes/${currentBox.id}/devices`, {
        qr_code: qrData
      });
    } catch (err) {
      console.error('Error adding device:', err);
    }
  };

  const completeBox = async () => {
    try {
      await request('POST', `/api/v1/boxes/${currentBox.id}/complete`);
      setCurrentBox(null);
      setDevices([]);
    } catch (err) {
      console.error('Error completing box:', err);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <div>
        <Card>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Current Box</h2>
            {currentBox ? (
              <div className="space-y-4">
                <p>Box ID: {currentBox.code}</p>
                <p>Devices: {devices.length}/24</p>
                {devices.length >= 24 ? (
                  <Button onClick={completeBox}>
                    Complete Box
                  </Button>
                ) : (
                  <QrReader onScan={handleDeviceScan} />
                )}
              </div>
            ) : (
              <Button onClick={createNewBox}>
                Create New Box
              </Button>
            )}
          </div>
        </Card>
      </div>

      <div>
        <Card>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Scanned Devices</h2>
            <div className="space-y-2">
              {devices.map((device, index) => (
                <div key={device.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{index + 1}. {device.imei}</span>
                  <span className="text-gray-500">{device.iccid}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BoxingProcess;
import React, { useState, useEffect } from 'react';
import { useQRScanner } from '../../hooks/useQRScanner';
import { Alert } from '../shared/Alert';
import { Table } from '../shared/Table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { registerDevice, getRecentDevices } from '../../services/api';

export const DeviceRegistration = () => {
  const { isScanning, startScanning, stopScanning, lastScannedCode } = useQRScanner();
  const [error, setError] = useState<string | null>(null);

  const { data: recentDevices, refetch: refetchDevices } = useQuery(
    ['recentDevices'],
    getRecentDevices
  );

  const registerMutation = useMutation(registerDevice, {
    onSuccess: () => {
      refetchDevices();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    if (lastScannedCode) {
      registerMutation.mutate({ qrCode: lastScannedCode });
    }
  }, [lastScannedCode]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between mb-6">
        <div className="w-1/5">
          <h2 className="text-xl font-bold mb-4">production Information</h2>
          <div className="bg-white p-4 rounded shadow">
            <div className="space-y-4">
              <div>
                <span className="text-gray-600">Order:</span>
                <span className="ml-2 font-semibold">ORD-2024-001</span>
              </div>
              <div>
                <span className="text-gray-600">Target:</span>
                <span className="ml-2 font-semibold">1000 units</span>
              </div>
              <div>
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-semibold">750 units</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-4/5 pl-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Device Registration</h2>
            <button
              onClick={isScanning ? stopScanning : startScanning}
              className={`px-4 py-2 rounded ${
                isScanning
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white transition-colors`}
            >
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </button>
          </div>

          {error && (
            <Alert 
              type="error" 
              message={error} 
              onClose={() => setError(null)} 
            />
          )}

          <div className="bg-white rounded shadow">
            <Table
              columns={[
                { header: 'IMEI', accessor: 'imei' },
                { header: 'ICCID', accessor: 'iccid' },
                { header: 'Timestamp', accessor: 'timestamp' },
                { header: 'Status', accessor: 'status' },
              ]}
              data={recentDevices || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useQRScanner } from '../../hooks/useQRScanner';
import { Scanner } from '../shared/Scanner';
import { Alert } from '../shared/Alert';
import { createBox, addDeviceToBox, getBoxDetails } from '../../services/api';

export const BoxManagement: React.FC = () => {
  const [currentBox, setCurrentBox] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isScanning, startScanning, stopScanning, lastScannedCode } = useQRScanner();

  const { data: boxDetails, refetch: refetchBox } = useQuery(
    ['boxDetails', currentBox],
    () => currentBox ? getBoxDetails(currentBox) : null,
    { enabled: !!currentBox }
  );

  const createBoxMutation = useMutation(createBox, {
    onSuccess: (data) => {
      setCurrentBox(data.boxId);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const addDeviceMutation = useMutation(addDeviceToBox, {
    onSuccess: () => {
      refetchBox();
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleScan = (code: string) => {
    if (currentBox) {
      addDeviceMutation.mutate({ boxId: currentBox, deviceCode: code });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Box Management</h2>
        <button
          onClick={() => createBoxMutation.mutate()}
          disabled={!!currentBox}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Create New Box
        </button>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {currentBox && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Current Box</h3>
            <div className="space-y-2">
              <p>Box ID: {currentBox}</p>
              <p>Devices: {boxDetails?.devices?.length || 0} / 24</p>
            </div>
          </div>

          <Scanner 
            onScan={handleScan}
            isEnabled={!!currentBox && boxDetails?.devices?.length < 24}
          />
        </div>
      )}
    </div>
  );
};

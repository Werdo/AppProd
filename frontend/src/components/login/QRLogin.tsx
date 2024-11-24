import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQRScanner } from '../../hooks/useQRScanner';

const QRLogin: React.FC = () => {
  const navigate = useNavigate();
  const { isScanning, startScanning, stopScanning, lastScannedCode } = useQRScanner();

  const handleScan = (code: string) => {
    // Aquí irá la lógica de autenticación
    navigate('/production-line');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Scan QR User Code</h1>
        <div className="flex flex-col items-center">
          <button
            onClick={isScanning ? stopScanning : startScanning}
            className={`w-full p-4 rounded-md ${
              isScanning ? 'bg-red-500' : 'bg-blue-500'
            } text-white font-medium`}
          >
            {isScanning ? 'Stop Scanning' : 'Start Scanning'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRLogin;


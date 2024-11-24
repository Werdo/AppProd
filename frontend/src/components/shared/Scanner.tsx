import React from 'react';
import { useQRScanner } from '../../hooks/useQRScanner';

interface ScannerProps {
  onScan: (code: string) => void;
  isEnabled?: boolean;
  className?: string;
}

export const Scanner: React.FC<ScannerProps> = ({
  onScan,
  isEnabled = true,
  className = ''
}) => {
  const { isScanning, startScanning, stopScanning, lastScannedCode, error, resetError } = useQRScanner();

  React.useEffect(() => {
    if (lastScannedCode && isEnabled) {
      onScan(lastScannedCode);
    }
  }, [lastScannedCode, onScan, isEnabled]);

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <h2 className="text-lg font-bold mb-4">QR Scanner</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
          <button 
            onClick={resetError}
            className="ml-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <button
        onClick={isScanning ? stopScanning : startScanning}
        disabled={!isEnabled}
        className={`
          w-full p-2 rounded-md 
          ${isScanning 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
          } 
          text-white
          ${!isEnabled && 'opacity-50 cursor-not-allowed'}
        `}
      >
        {isScanning ? 'Stop Scanning' : 'Start Scanning'}
      </button>

      {lastScannedCode && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <div className="text-sm text-gray-600">Last scanned:</div>
          <div className="font-mono">{lastScannedCode}</div>
        </div>
      )}
    </div>
  );
};

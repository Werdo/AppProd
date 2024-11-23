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
  const { isScanning, startScanning, stopScanning, lastScannedCode, error } = useQRScanner();

  React.useEffect(() => {
    if (lastScannedCode && isEnabled) {
      onScan(lastScannedCode);
    }
  }, [lastScannedCode, onScan, isEnabled]);

  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">QR Scanner</h3>
        <button
          onClick={isScanning ? stopScanning : startScanning}
          disabled={!isEnabled}
          className={`
            px-4 py-2 rounded-md 
            ${isScanning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
            }
            ${!isEnabled && 'opacity-50 cursor-not-allowed'}
          `}
        >
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </button>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      <div className="text-sm text-gray-500 mt-2">
        {isScanning ? (
          <div className="flex items-center">
            <div className="animate-pulse mr-2 h-2 w-2 rounded-full bg-green-500"></div>
            Scanning...
          </div>
        ) : (
          'Scanner ready'
        )}
      </div>
      
      {lastScannedCode && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-500 mb-1">Last scanned code:</div>
          <div className="font-mono text-sm">{lastScannedCode}</div>
        </div>
      )}
    </div>
  );
};

import { useState, useCallback, useEffect } from 'react';

export interface QRScannerHook {
  isScanning: boolean;
  startScanning: () => void;
  stopScanning: () => void;
  lastScannedCode: string | null;
  error: string | null;
  resetError: () => void;
}

export const useQRScanner = (): QRScannerHook => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isScanning) return;

    if (event.key === 'Enter') {
      try {
        const mockCode = `QR-${Date.now()}`;
        setLastScannedCode(mockCode);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error scanning code');
      }
    }
  }, [isScanning]);

  useEffect(() => {
    if (isScanning) {
      window.addEventListener('keypress', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [isScanning, handleKeyPress]);

  const startScanning = () => {
    setIsScanning(true);
    setError(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setError(null);
  };

  const resetError = () => setError(null);

  return {
    isScanning,
    startScanning,
    stopScanning,
    lastScannedCode,
    error,
    resetError
  };
};

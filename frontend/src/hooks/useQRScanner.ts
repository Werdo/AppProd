import { useState, useCallback, useEffect, useRef } from 'react';
import { QRScannerHook } from '../types/scanner';

export const useQRScanner = (): QRScannerHook => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Usar refs para mantener el estado entre renders
  const bufferRef = useRef<string>('');
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isScanning) return;

    // Si es un enter, procesamos el código
    if (event.key === 'Enter' && bufferRef.current.length > 0) {
      setLastScannedCode(bufferRef.current);
      bufferRef.current = '';
    } else {
      // Añadimos el carácter al buffer
      bufferRef.current += event.key;
      
      // Limpiamos cualquier timeout existente
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      
      // Establecemos un nuevo timeout
      timeoutIdRef.current = setTimeout(() => {
        bufferRef.current = '';
      }, 100);
    }
  }, [isScanning]);

  const startScanning = useCallback(() => {
    setIsScanning(true);
    setError(null);
    bufferRef.current = '';
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    window.addEventListener('keypress', handleKeyPress);
  }, [handleKeyPress]);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    bufferRef.current = '';
    window.removeEventListener('keypress', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyPress]);

  return {
    isScanning,
    startScanning,
    stopScanning,
    lastScannedCode,
    error
  };
};

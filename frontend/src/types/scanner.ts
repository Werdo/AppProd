export interface QRScannerHook {
  isScanning: boolean;
  startScanning: () => void;
  stopScanning: () => void;
  lastScannedCode: string | null;
  error: string | null;
}

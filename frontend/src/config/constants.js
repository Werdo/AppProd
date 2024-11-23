export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

export const PRINTER_TYPES = {
  ZEBRA: 'zebra',
  EPSON: 'epson',
  BROTHER: 'brother',
};

export const BOX_TYPES = {
  EXPORT: 'export',
  MASTER: 'master',
};

export const BOX_STATES = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
};

export const DEVICE_STATES = {
  REGISTERED: 'registered',
  IN_PROCESS: 'in_process',
  COMPLETED: 'completed',
  ERROR: 'error',
};
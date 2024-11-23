import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerDevice = async (data: { qrCode: string }) => {
  const response = await api.post('/devices', data);
  return response.data;
};

export const getRecentDevices = async () => {
  const response = await api.get('/devices/recent');
  return response.data;
};

export const createBox = async () => {
  const response = await api.post('/boxes');
  return response.data;
};

export const addDeviceToBox = async (data: { boxId: string; deviceCode: string }) => {
  const response = await api.post(`/boxes/${data.boxId}/devices`, {
    deviceCode: data.deviceCode,
  });
  return response.data;
};

export const getBoxDetails = async (boxId: string) => {
  const response = await api.get(`/boxes/${boxId}`);
  return response.data;
};

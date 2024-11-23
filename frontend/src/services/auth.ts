import axios from 'axios';
import { User } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const loginWithQR = async (qrCode: string): Promise<{ token: string; user: User }> => {
  const response = await axios.post(`${API_URL}/auth/login`, { qrCode });
  return response.data;
};

export const validateToken = async (token: string): Promise<User> => {
  const response = await axios.get(`${API_URL}/auth/validate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

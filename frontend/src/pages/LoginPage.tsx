import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login('test-token');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Production System</h1>
          <p className="mt-2 text-gray-600">Please scan your ID to continue</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleLogin}
            className="w-full flex justify-center py-3 px-4 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white 
                     bg-blue-600 hover:bg-blue-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login with ID Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { QrReader } from '@/components/QrReader';
import { Button, Input } from '@/components/common';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [qrMode, setQrMode] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleQrScan = async (data) => {
    if (data) {
      setLoading(true);
      try {
        await login({ qrCode: data });
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      await login({
        username: formData.get('username'),
        password: formData.get('password')
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Production System Login
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {qrMode ? (
            <>
              <QrReader onScan={handleQrScan} />
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setQrMode(false)}
              >
                Switch to Manual Login
              </Button>
            </>
          ) : (
            <form onSubmit={handleManualLogin} className="space-y-4">
              <Input
                name="username"
                label="Username"
                required
                autoComplete="username"
              />
              <Input
                name="password"
                type="password"
                label="Password"
                required
                autoComplete="current-password"
              />
              <Button
                type="submit"
                className="w-full"
                isLoading={loading}
              >
                Login
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setQrMode(true)}
              >
                Switch to QR Login
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

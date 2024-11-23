import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import DeviceRegistration from '@/pages/DeviceRegistration';

const server = setupServer(
  rest.post('/api/v1/devices', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 1,
        imei: '123456789',
        iccid: '987654321',
        status: 'registered'
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('DeviceRegistration', () => {
  test('renders QR scanner by default', () => {
    render(<DeviceRegistration />);
    expect(screen.getByTestId('qr-scanner')).toBeInTheDocument();
  });

  test('handles successful device registration', async () => {
    render(<DeviceRegistration />);
    
    // Simulate QR scan
    const scanData = '123456789 987654321';
    fireEvent.scan(screen.getByTestId('qr-scanner'), scanData);

    await waitFor(() => {
      expect(screen.getByText('123456789')).toBeInTheDocument();
    });
  });

  test('displays error on failed registration', async () => {
    server.use(
      rest.post('/api/v1/devices', (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );

    render(<DeviceRegistration />);
    
    const scanData = 'invalid_data';
    fireEvent.scan(screen.getByTestId('qr-scanner'), scanData);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
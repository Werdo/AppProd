import { render, screen } from '@testing-library/react';
import { DeviceRegistration } from '../DeviceRegistration';

test('renders device registration form', () => {
  render(<DeviceRegistration />);
  expect(screen.getByText(/Register Device/i)).toBeInTheDocument();
});

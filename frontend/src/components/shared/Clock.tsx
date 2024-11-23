import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ClockProps {
  format24Hour?: boolean;
  showSeconds?: boolean;
  className?: string;
}

export const Clock: React.FC<ClockProps> = ({
  format24Hour = true,
  showSeconds = true,
  className = '',
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatString = `${format24Hour ? 'HH:mm' : 'hh:mm a'}${showSeconds ? ':ss' : ''}`;

  return (
    <div className={`font-mono text-lg ${className}`}>
      {format(time, formatString)}
    </div>
  );
};

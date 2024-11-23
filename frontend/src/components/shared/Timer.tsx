
import React, { useState, useEffect } from 'react';

interface TimerProps {
  startTime: Date;
  className?: string;
  onTimeUpdate?: (elapsed: number) => void;
}

export const Timer: React.FC<TimerProps> = ({ 
  startTime, 
  className = '',
  onTimeUpdate 
}) => {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const newElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(newElapsed);
      if (onTimeUpdate) {
        onTimeUpdate(newElapsed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hrs > 0) parts.push(hrs.toString().padStart(2, '0'));
    parts.push(mins.toString().padStart(2, '0'));
    parts.push(secs.toString().padStart(2, '0'));

    return parts.join(':');
  };

  return (
    <div className={`font-mono ${className}`}>
      {formatTime(elapsed)}
    </div>
  );
};

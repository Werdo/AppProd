import React from 'react';
import { format } from 'date-fns';

interface DateDisplayProps {
  date: Date;
  formatString?: string;
  className?: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  formatString = 'PPP',
  className = '',
}) => {
  return (
    <div className={className}>
      {format(date, formatString)}
    </div>
  );
};

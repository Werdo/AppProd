import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-sm overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
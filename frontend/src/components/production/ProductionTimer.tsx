import React from 'react';
import { Timer } from '../shared/Timer';

interface productionTimerProps {
  startTime: Date;
  totalUnits: number;
  completedUnits: number;
}

export const productionTimer: React.FC<productionTimerProps> = ({
  startTime,
  totalUnits,
  completedUnits,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Tiempo Transcurrido</h3>
          <Timer 
            startTime={startTime}
            className="text-2xl font-semibold text-gray-900"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Progreso</h3>
          <div className="text-2xl font-semibold text-gray-900">
            {completedUnits} / {totalUnits}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(completedUnits / totalUnits) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

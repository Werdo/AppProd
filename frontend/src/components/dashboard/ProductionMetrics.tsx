import React from 'react';
import { BarChart2 } from 'lucide-react';

const ProductionMetrics: React.FC = () => {
  const productionData = [
    { hour: '08:00', units: 42 },
    { hour: '09:00', units: 85 },
    { hour: '10:00', units: 123 },
    { hour: '11:00', units: 165 },
    { hour: '12:00', units: 189 }
  ];

  const totalUnits = productionData.reduce((sum, item) => sum + item.units, 0);
  const targetUnits = 1000;
  const progress = (totalUnits / targetUnits) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Production Today</h2>
        <BarChart2 className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-2xl font-bold">{totalUnits}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Target</div>
            <div className="text-2xl font-bold">{targetUnits}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium text-gray-600 mb-2">Hourly Production</div>
          <div className="space-y-2">
            {productionData.map((data, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{data.hour}</span>
                <span className="font-medium">{data.units} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionMetrics;
export { ProductionMetrics };

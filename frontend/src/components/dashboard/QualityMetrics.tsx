import React from 'react';
import { CheckCircle, AlertCircle, BarChart } from 'lucide-react';

const QualityMetrics: React.FC = () => {
  const metrics = [
    {
      label: 'Pass Rate',
      value: 99.8,
      target: 99.5,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      label: 'Defect Rate',
      value: 0.2,
      target: 0.5,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    },
    {
      label: 'First Pass Yield',
      value: 98.5,
      target: 98.0,
      icon: <BarChart className="h-5 w-5 text-blue-500" />,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-6">Quality Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-2">
              {metric.icon}
              <span className="text-sm font-medium text-gray-600">
                {metric.label}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">{metric.value}%</div>
            <div className="text-xs text-gray-500">
              Target: {metric.target}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QualityMetrics;
export { QualityMetrics };

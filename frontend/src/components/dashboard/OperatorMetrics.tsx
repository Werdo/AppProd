import React from 'react';
import { Users } from 'lucide-react';

const OperatorMetrics: React.FC = () => {
  const operatorData = [
    { name: 'John Doe', units: 245, efficiency: 98, status: 'Active' },
    { name: 'Jane Smith', units: 232, efficiency: 96, status: 'Active' },
    { name: 'Mike Johnson', units: 180, efficiency: 92, status: 'Break' },
    { name: 'Sarah Williams', units: 195, efficiency: 94, status: 'Active' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Operator Performance</h2>
        <Users className="h-5 w-5 text-gray-400" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operator
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Efficiency
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {operatorData.map((operator, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {operator.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="text-sm text-gray-900">{operator.units}</div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="text-sm text-gray-900">{operator.efficiency}%</div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${operator.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    ${operator.status === 'Break' ? 'bg-yellow-100 text-yellow-800' : ''}
                  `}>
                    {operator.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperatorMetrics;
export { OperatorMetrics };

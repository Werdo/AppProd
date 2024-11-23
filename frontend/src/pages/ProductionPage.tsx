import React from 'react';
import { Scanner } from '../components/shared/Scanner';

const ProductionPage: React.FC = () => {
  const handleScan = (code: string) => {
    console.log('Scanned:', code);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Production</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Information</h2>
            <div className="space-y-4">
              <div>
                <span className="text-gray-600">Order ID:</span>
                <span className="ml-2 font-medium">ORD-2024-001</span>
              </div>
              <div>
                <span className="text-gray-600">Target:</span>
                <span className="ml-2 font-medium">1000 units</span>
              </div>
              <div>
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-medium">0 units</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Scanner onScan={handleScan} />

          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Scans</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Scans will be listed here */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionPage;

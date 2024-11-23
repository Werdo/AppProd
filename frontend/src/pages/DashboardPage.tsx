import React from 'react';
import { ProductionMetrics } from '../components/dashboard/ProductionMetrics';
import { OperatorMetrics } from '../components/dashboard/OperatorMetrics';
import { QualityMetrics } from '../components/dashboard/QualityMetrics';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Production Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionMetrics />
        <QualityMetrics />
      </div>
      
      <OperatorMetrics />
    </div>
  );
};

export default DashboardPage;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import QRLogin from '../components/login/QRLogin';
import ProductionLine from '../components/production/ProductionLine';
import ProductionStation from '../components/production/ProductionStation';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<QRLogin />} />
      <Route path="/production-line" element={<ProductionLine />} />
      <Route path="/production/:line" element={<ProductionStation />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;


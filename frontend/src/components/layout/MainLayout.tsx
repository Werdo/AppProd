import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import Sidebar from './Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

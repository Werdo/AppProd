import React from 'react';

const BoxManagementPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Box Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Current Box</h2>
          <div className="space-y-2">
            <p>Box #: BOX-2024-001</p>
            <p>Devices: 0/24</p>
            <div className="mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                New Box
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Scanned Devices</h2>
          <div className="space-y-2">
            {/* Scanned devices will be listed here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxManagementPage;

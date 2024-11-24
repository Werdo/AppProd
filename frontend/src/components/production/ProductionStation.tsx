import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Scanner } from '../shared/Scanner';

interface ScannedItem {
  id: string;
  time: string;
}

const ProductionStation: React.FC = () => {
  const { lineId } = useParams<{ lineId: string }>();
  const navigate = useNavigate();
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScan = (code: string) => {
    const newItem: ScannedItem = {
      id: code,
      time: new Date().toLocaleTimeString()
    };
    setScannedItems(prev => [...prev, newItem]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Production Line {lineId}</h1>
        <button
          onClick={() => navigate('/production-line')}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Back to Lines
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Scanner onScan={handleScan} />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order Status</h2>
              <div className="text-gray-600">{currentTime}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600">Total Order</div>
                <div className="text-2xl font-bold">1000</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600">Completed</div>
                <div className="text-2xl font-bold">{scannedItems.length}</div>
              </div>
            </div>

            <h3 className="font-bold mb-2">Recent Scans</h3>
            <div className="max-h-60 overflow-y-auto">
              {scannedItems.map((item, index) => (
                <div 
                  key={index}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="font-mono">{item.id}</span>
                  <span className="text-gray-600">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionStation;

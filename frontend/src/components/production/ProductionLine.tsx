import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductionLine: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Select Production Line</h1>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((line) => (
          <button
            key={line}
            onClick={() => navigate(`/production/${line}`)}
            className="p-8 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            Line {line}
          </button>
        ))}
      </div>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-4 py-2 bg-gray-200 rounded"
      >
        Back
      </button>
    </div>
  );
};

export default ProductionLine;

import React from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, Button } from '@/components/common';

const BoxingReport = () => {
  const [reports, setReports] = React.useState([]);
  const { request } = useApi();

  const fetchBoxReport = async (boxId) => {
    try {
      const response = await request('GET', `/api/v1/reports/boxing/${boxId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching box report:', err);
    }
  };

  const printBoxLabel = async (boxId) => {
    try {
      await request('POST', `/api/v1/print/box-label/${boxId}`);
    } catch (err) {
      console.error('Error printing box label:', err);
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-6">Boxing Reports</h2>
      
      <div className="space-y-4">
        {reports.map(report => (
          <div key={report.id} className="border rounded p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">Box {report.boxId}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => printBoxLabel(report.boxId)}
                >
                  Print Label
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => window.open(`/reports/boxing/${report.boxId}`)}
                >
                  View Details
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Contents</h4>
                <ul className="space-y-1 text-sm">
                  {report.devices.map(device => (
                    <li key={device.id} className="flex justify-between">
                      <span>{device.imei}</span>
                      <span className="text-gray-500">{device.position}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Production Info</h4>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-gray-500">Order</dt>
                  <dd>{report.orderNumber}</dd>
                  <dt className="text-gray-500">Operator</dt>
                  <dd>{report.operator}</dd>
                  <dt className="text-gray-500">Duration</dt>
                  <dd>{report.duration} min</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BoxingReport;
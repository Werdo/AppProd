import React from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, Button } from '@/components/common';

const PrintManager = () => {
  const [printQueue, setPrintQueue] = React.useState([]);
  const [printerStatus, setPrinterStatus] = React.useState('ready');
  const { request } = useApi();

  React.useEffect(() => {
    const fetchPrintQueue = async () => {
      try {
        const response = await request('GET', '/api/v1/print/queue');
        setPrintQueue(response.data);
      } catch (err) {
        console.error('Error fetching print queue:', err);
      }
    };

    fetchPrintQueue();
    const interval = setInterval(fetchPrintQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const printLabel = async (jobId) => {
    try {
      await request('POST', `/api/v1/print/jobs/${jobId}/print`);
      setPrintQueue(queue => queue.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error printing label:', err);
    }
  };

  const cancelPrint = async (jobId) => {
    try {
      await request('DELETE', `/api/v1/print/jobs/${jobId}`);
      setPrintQueue(queue => queue.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error canceling print job:', err);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Print Queue</h2>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${
                printerStatus === 'ready' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-600">
                Printer Status: {printerStatus}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {printQueue.map(job => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{job.type}</p>
                  <p className="text-sm text-gray-500">{job.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => printLabel(job.id)}
                    disabled={printerStatus !== 'ready'}
                  >
                    Print
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => cancelPrint(job.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))}

            {printQueue.length === 0 && (
              <p className="text-center text-gray-500">
                No pending print jobs
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrintManager;
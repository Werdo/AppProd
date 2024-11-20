import React from 'react';
import { useApi } from '@/hooks/useApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card, Button } from '@/components/common';

const PrintQueue = () => {
  const [queue, setQueue] = React.useState([]);
  const [status, setStatus] = React.useState({});
  const { request } = useApi();
  const { subscribe } = useWebSocket('ws://localhost:8000/ws/printer');

  React.useEffect(() => {
    subscribe((data) => {
      if (data.type === 'queue_update') {
        setQueue(data.queue);
      } else if (data.type === 'status_update') {
        setStatus(data.status);
      }
    });
  }, [subscribe]);

  const printJob = async (jobId) => {
    try {
      await request('POST', `/api/v1/print/jobs/${jobId}/print`);
    } catch (err) {
      console.error('Error printing job:', err);
    }
  };

  const cancelJob = async (jobId) => {
    try {
      await request('DELETE', `/api/v1/print/jobs/${jobId}`);
    } catch (err) {
      console.error('Error canceling job:', err);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Print Queue</h2>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${
            status.online ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-gray-600">
            {status.online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {queue.map(job => (
          <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{job.template}</p>
              <p className="text-sm text-gray-500">
                {job.quantity} copies
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => printJob(job.id)}
                disabled={!status.online}
              >
                Print Now
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => cancelJob(job.id)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PrintQueue;
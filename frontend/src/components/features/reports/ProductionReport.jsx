import React from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, Button, DatePicker } from '@/components/common';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const ProductionReport = () => {
  const [dateRange, setDateRange] = React.useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [data, setData] = React.useState(null);
  const { request, loading } = useApi();

  const fetchReport = async () => {
    try {
      const response = await request('GET', '/api/v1/reports/production', {
        params: {
          start_date: dateRange.start.toISOString(),
          end_date: dateRange.end.toISOString()
        }
      });
      setData(response.data);
    } catch (err) {
      console.error('Error fetching report:', err);
    }
  };

  const exportPDF = async () => {
    try {
      const response = await request('GET', '/api/v1/reports/production/export', {
        params: {
          start_date: dateRange.start.toISOString(),
          end_date: dateRange.end.toISOString(),
          format: 'pdf'
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'production-report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Error exporting report:', err);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Production Report</h2>
          <div className="flex gap-4">
            <DatePicker
              selected={dateRange.start}
              onChange={date => setDateRange(prev => ({
                ...prev,
                start: date
              }))}
              selectsStart
              startDate={dateRange.start}
              endDate={dateRange.end}
            />
            <DatePicker
              selected={dateRange.end}
              onChange={date => setDateRange(prev => ({
                ...prev,
                end: date
              }))}
              selectsEnd
              startDate={dateRange.start}
              endDate={dateRange.end}
              minDate={dateRange.start}
            />
            <Button
              onClick={fetchReport}
              isLoading={loading}
            >
              Generate Report
            </Button>
            <Button
              variant="secondary"
              onClick={exportPDF}
            >
              Export PDF
            </Button>
          </div>
        </div>

        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Total Production</h3>
                <p className="text-3xl font-bold text-primary-600">
                  {data.totalDevices}
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Success Rate</h3>
                <p className="text-3xl font-bold text-green-600">
                  {data.successRate}%
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Average Time</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {data.averageTime} min
                </p>
              </Card>
            </div>

            <div className="h-96">
              <LineChart
                width={800}
                height={400}
                data={data.dailyProduction}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="production"
                  stroke="#8884d8"
                  name="Units Produced"
                />
                <Line
                  type="monotone"
                  dataKey="defects"
                  stroke="#82ca9d"
                  name="Defects"
                />
              </LineChart>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductionReport;
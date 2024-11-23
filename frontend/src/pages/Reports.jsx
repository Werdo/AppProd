import React from 'react';
import { useApi } from '../hooks/useApi';
import { Card, Button, DatePicker } from '../components/common';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

const Reports = () => {
  const [dateRange, setDateRange] = React.useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [reports, setReports] = React.useState(null);
  const { request, loading } = useApi();

  const generateReport = async () => {
    try {
      const response = await request('GET', '/reports/production', {
        params: {
          start_date: dateRange.start.toISOString(),
          end_date: dateRange.end.toISOString()
        }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const exportReport = async (format) => {
    try {
      const response = await request('GET', `/reports/export`, {
        params: {
          start_date: dateRange.start.toISOString(),
          end_date: dateRange.end.toISOString(),
          format
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Production Reports</h2>
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
              onClick={generateReport}
              isLoading={loading}
            >
              Generate Report
            </Button>
          </div>
        </div>

        {reports && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">
                  Total Production
                </h3>
                <p className="text-3xl font-bold text-primary-600">
                  {reports.totalDevices}
                </p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">
                  Success Rate
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {reports.successRate}%
                </p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-lg font
                <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">
                  Average Time
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {reports.averageTime} min
                </p>
              </Card>
            </div>

            <div className="h-96">
              <LineChart
                width={800}
                height={400}
                data={reports.dailyProduction}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
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

            <div className="flex justify-end gap-4">
              <Button
                variant="secondary"
                onClick={() => exportReport('pdf')}
              >
                Export PDF
              </Button>
              <Button
                variant="secondary"
                onClick={() => exportReport('excel')}
              >
                Export Excel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;

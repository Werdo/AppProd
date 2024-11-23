import React from 'react';
import { Card, Input, Select, Button } from '@/components/common';

const AutomationDesigner = () => {
  const [config, setConfig] = React.useState({
    name: '',
    schedule: {
      type: 'recurring',
      frequency: 'daily',
      time: '00:00',
      daysOfWeek: [],
      timezone: 'UTC'
    },
    dataSource: {
      type: 'database',
      config: {}
    },
    processing: {
      transformations: [],
      validations: [],
      calculations: []
    },
    distribution: {
      destinations: []
    },
    notification: {
      type: 'email',
      recipients: []
    }
  });

  const addTransformation = (type) => {
    setConfig(prev => ({
      ...prev,
      processing: {
        ...prev.processing,
        transformations: [
          ...prev.processing.transformations,
          {
            type,
            config: getDefaultTransformationConfig(type)
          }
        ]
      }
    }));
  };

  const addDistributionDestination = (type) => {
    setConfig(prev => ({
      ...prev,
      distribution: {
        ...prev.distribution,
        destinations: [
          ...prev.distribution.destinations,
          {
            type,
            config: getDefaultDistributionConfig(type)
          }
        ]
      }
    }));
  };

  const saveAutomation = async () => {
    try {
      await AutomatedReportService.setupAutomatedReport(config);
      // Mostrar notificación de éxito
    } catch (error) {
      // Mostrar error
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Report Automation</h2>

        <div className="space-y-4">
          <Input
            label="Automation Name"
            value={config.name}
            onChange={e => setConfig(prev => ({
              ...prev,
              name: e.target.value
            }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Schedule Type"
              value={config.schedule.type}
              options={[
                { value: 'recurring', label: 'Recurring' },
                { value: 'oneTime', label: 'One Time' }
              ]}
              onChange={value => setConfig(prev => ({
                ...prev,
                schedule: {
                  ...prev.schedule,
                  type: value
                }
              }))}
            />

            {config.schedule.type === 'recurring' && (
              <Select
                label="Frequency"
                value={config.schedule.frequency}
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' }
                ]}
                onChange={value => setConfig(prev => ({
                  ...prev,
                  schedule: {
                    ...prev.schedule,
                    frequency: value
                  }
                }))}
              />
            )}
          </div>

          {/* Configuración de fuente de datos */}
          <Card className="p-4">
            <h3 className="font-medium mb-2">Data Source</h3>
            <Select
              label="Source Type"
              value={config.dataSource.type}
              options={[
                { value: 'database', label: 'Database' },
                { value: 'api', label: 'API' },
                { value: 'file', label: 'File' }
              ]}
              onChange={value => setConfig(prev => ({
                ...prev,
                dataSource: {
                  type: value,
                  config: {}
                }
              }))}
            />
            {/* Campos específicos según el tipo de fuente */}
          </Card>

          {/* Transformaciones y validaciones */}
          <Card className="p-4">
            <h3 className="font-medium mb-2">Data Processing</h3>
            <div className="space-y-2">
              <Button
                size="sm"
                onClick={() => addTransformation('filter')}
              >
                Add Filter
              </Button>
              <Button
                size="sm"
                onClick={() => addTransformation('transform')}
              >
                Add Transformation
              </Button>
            </div>
            {/* Lista de transformaciones configuradas */}
          </Card>

          {/* Configuración de distribución */}
          <Card className="p-4">
            <h3 className="font-medium mb-2">Distribution</h3>
            <Button
              size="sm"
              onClick={() => addDistributionDestination('email')}
            >
              Add Email Destination
            </Button>
            {/* Lista de destinos configurados */}
          </Card>

          <Button
            className="w-full"
            onClick={saveAutomation}
          >
            Save Automation
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AutomationDesigner;
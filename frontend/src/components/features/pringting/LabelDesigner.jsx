import React from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, Input, Button } from '@/components/common';

const LabelDesigner = () => {
  const [template, setTemplate] = React.useState({
    name: '',
    width: 100,
    height: 50,
    elements: []
  });

  const addElement = (type) => {
    setTemplate(prev => ({
      ...prev,
      elements: [...prev.elements, {
        id: Date.now(),
        type,
        x: 0,
        y: 0,
        width: 50,
        height: 20,
        content: '',
        fontSize: 12
      }]
    }));
  };

  const updateElement = (id, updates) => {
    setTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    }));
  };

  const saveTemplate = async () => {
    try {
      await request('POST', '/api/v1/print/templates', template);
    } catch (err) {
      console.error('Error saving template:', err);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Label Designer</h2>
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={template.name}
            onChange={e => setTemplate(prev => ({
              ...prev,
              name: e.target.value
            }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Width (mm)"
              type="number"
              value={template.width}
              onChange={e => setTemplate(prev => ({
                ...prev,
                width: parseInt(e.target.value)
              }))}
            />
            <Input
              label="Height (mm)"
              type="number"
              value={template.height}
              onChange={e => setTemplate(prev => ({
                ...prev,
                height: parseInt(e.target.value)
              }))}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => addElement('text')}>Add Text</Button>
            <Button onClick={() => addElement('barcode')}>Add Barcode</Button>
            <Button onClick={() => addElement('qr')}>Add QR Code</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <div
          className="border rounded"
          style={{
            width: `${template.width * 2}px`,
            height: `${template.height * 2}px`,
            position: 'relative'
          }}
        >
          {template.elements.map(element => (
            <div
              key={element.id}
              style={{
                position: 'absolute',
                left: element.x * 2,
                top: element.y * 2,
                width: element.width * 2,
                height: element.height * 2,
                border: '1px dashed #ccc'
              }}
            >
              {element.type}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LabelDesigner;
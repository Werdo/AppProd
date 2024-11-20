import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TemplateDesigner = () => {
  const [template, setTemplate] = React.useState({
    sections: [],
    styles: {},
    parameters: {}
  });

  const [availableComponents] = React.useState([
    { id: 'table', type: 'table', name: 'Data Table' },
    { id: 'chart', type: 'chart', name: 'Chart' },
    { id: 'text', type: 'text', name: 'Text Block' },
    { id: 'image', type: 'image', name: 'Image' },
    { id: 'pageBreak', type: 'pageBreak', name: 'Page Break' }
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (result.source.droppableId === 'components' &&
        result.destination.droppableId === 'template') {
      // Add new component to template
      const component = availableComponents.find(
        c => c.id === result.draggableId
      );
      
      setTemplate(prev => ({
        ...prev,
        sections: [
          ...prev.sections,
          {
            id: `${component.type}-${Date.now()}`,
            type: component.type,
            config: getDefaultConfig(component.type)
          }
        ]
      }));
    }
  };

  const getDefaultConfig = (type) => {
    switch (type) {
      case 'table':
        return {
          columns: [],
          dataSource: '',
          pagination: true
        };
      case 'chart':
        return {
          type: 'bar',
          dataSource: '',
          xAxis: '',
          yAxis: ''
        };
      // Otros tipos...
      default:
        return {};
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Components</h3>
          <Droppable droppableId="components">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {availableComponents.map((component, index) => (
                  <Draggable
                    key={component.id}
                    draggableId={component.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 bg-gray-50 rounded border border-gray-200"
                      >
                        {component.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <div className="col-span-3">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Template</h3>
            <Droppable droppableId="template">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[500px] border-2 border-dashed border-gray-200 rounded p-4"
                >
                  {template.sections.map((section, index) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 bg-gray-50 rounded mb-4"
                        >
                          <ComponentEditor
                            component={section}
                            onUpdate={(config) => {
                              const newSections = [...template.sections];
                              newSections[index] = {
                                ...section,
                                config
                              };
                              setTemplate(prev => ({
                                ...prev,
                                sections: newSections
                              }));
                            }}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default TemplateDesigner;
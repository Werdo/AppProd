class LabelTemplateManager {
    constructor() {
      this.templates = new Map();
      this.printerManager = new PrinterManager();
    }
  
    registerTemplate(name, config) {
      const template = new LabelTemplate(config);
      this.templates.set(name, template);
      return template;
    }
  
    async renderLabel(templateName, data) {
      const template = this.templates.get(templateName);
      if (!template) {
        throw new Error(`Template ${templateName} not found`);
      }
  
      return template.render(data);
    }
  
    async printLabel(templateName, data, printer) {
      const rendered = await this.renderLabel(templateName, data);
      return this.printerManager.print(rendered, printer);
    }
  }
  
  class LabelTemplate {
    constructor(config) {
      this.width = config.width;
      this.height = config.height;
      this.dpi = config.dpi || 203;
      this.elements = config.elements || [];
      this.orientation = config.orientation || 'portrait';
    }
  
    render(data) {
      // Renderizar basado en el tipo de impresora
      const commands = {
        zpl: this.renderZPL(data),
        epl: this.renderEPL(data),
        escp: this.renderESCP(data)
      };
  
      return commands;
    }
  
    renderZPL(data) {
      let zpl = '^XA'; // Inicio de etiqueta ZPL
  
      this.elements.forEach(element => {
        switch (element.type) {
          case 'text':
            zpl += this.renderZPLText(element, data);
            break;
          case 'barcode':
            zpl += this.renderZPLBarcode(element, data);
            break;
          case 'qr':
            zpl += this.renderZPLQR(element, data);
            break;
          case 'image':
            zpl += this.renderZPLImage(element, data);
            break;
        }
      });
  
      zpl += '^XZ'; // Fin de etiqueta ZPL
      return zpl;
    }
  
    renderZPLText(element, data) {
      const value = this.resolveValue(element.value, data);
      return `^FO${element.x},${element.y}^A0N,${element.fontSize},${element.fontSize}^FD${value}^FS`;
    }
  
    renderZPLBarcode(element, data) {
      const value = this.resolveValue(element.value, data);
      return `^FO${element.x},${element.y}^BY${element.width}^BC,${element.height},N,N,N^FD${value}^FS`;
    }
  
    resolveValue(template, data) {
      return template.replace(/\${(\w+)}/g, (match, key) => {
        return data[key] || match;
      });
    }
  }
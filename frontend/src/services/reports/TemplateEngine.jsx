class TemplateEngine {
    static FORMATS = {
      PDF: 'pdf',
      EXCEL: 'excel',
      HTML: 'html',
      CSV: 'csv',
      JSON: 'json'
    };
  
    constructor() {
      this.templates = new Map();
      this.formatters = new Map();
      this.registerDefaultFormatters();
    }
  
    registerTemplate(name, template) {
      this.templates.set(name, template);
    }
  
    registerFormatter(format, formatter) {
      this.formatters.set(format, formatter);
    }
  
    async render(templateName, data, format) {
      const template = this.templates.get(templateName);
      if (!template) {
        throw new Error(`Template ${templateName} not found`);
      }
  
      const formatter = this.formatters.get(format);
      if (!formatter) {
        throw new Error(`Formatter for ${format} not found`);
      }
  
      const rendered = await template(data);
      return formatter(rendered);
    }
  
    registerDefaultFormatters() {
      // PDF Formatter
      this.registerFormatter(TemplateEngine.FORMATS.PDF, async (data) => {
        const pdf = new PDFDocument();
        await this.renderPDF(pdf, data);
        return pdf.output();
      });
  
      // Excel Formatter
      this.registerFormatter(TemplateEngine.FORMATS.EXCEL, async (data) => {
        const workbook = new ExcelJS.Workbook();
        await this.renderExcel(workbook, data);
        return workbook.xlsx.writeBuffer();
      });
  
      // Otros formatos...
    }
  }
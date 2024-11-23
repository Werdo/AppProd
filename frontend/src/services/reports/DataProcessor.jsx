class DataProcessor {
    constructor() {
      this.transformers = new Map();
      this.validators = new Map();
      this.registerDefaultTransformers();
      this.registerDefaultValidators();
    }
  
    registerTransformer(name, transformer) {
      this.transformers.set(name, transformer);
    }
  
    registerValidator(name, validator) {
      this.validators.set(name, validator);
    }
  
    async processData(data, config) {
      // Validar datos
      await this.validateData(data, config.validations);
  
      // Aplicar transformaciones
      let processedData = await this.transformData(data, config.transformations);
  
      // Agrupar datos si es necesario
      if (config.groupBy) {
        processedData = this.groupData(processedData, config.groupBy);
      }
  
      // Agregar cálculos
      if (config.calculations) {
        processedData = this.addCalculations(processedData, config.calculations);
      }
  
      return processedData;
    }
  
    async validateData(data, validations = []) {
      for (const validation of validations) {
        const validator = this.validators.get(validation.type);
        if (!validator) {
          throw new Error(`Validator ${validation.type} not found`);
        }
  
        const isValid = await validator(data, validation.config);
        if (!isValid) {
          throw new Error(`Validation failed: ${validation.message}`);
        }
      }
    }
  
    async transformData(data, transformations = []) {
      let result = data;
  
      for (const transformation of transformations) {
        const transformer = this.transformers.get(transformation.type);
        if (!transformer) {
          throw new Error(`Transformer ${transformation.type} not found`);
        }
  
        result = await transformer(result, transformation.config);
      }
  
      return result;
    }
  
    groupData(data, groupConfig) {
      const { field, aggregations } = groupConfig;
      const groups = new Map();
  
      for (const item of data) {
        const key = item[field];
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key).push(item);
      }
  
      return Array.from(groups.entries()).map(([key, items]) => {
        const group = { [field]: key };
        
        for (const agg of aggregations) {
          group[agg.name] = this.calculateAggregation(items, agg);
        }
  
        return group;
      });
    }
  
    calculateAggregation(items, aggregation) {
      switch (aggregation.type) {
        case 'sum':
          return items.reduce((sum, item) => sum + item[aggregation.field], 0);
        case 'average':
          return items.reduce((sum, item) => sum + item[aggregation.field], 0) / items.length;
        case 'count':
          return items.length;
        case 'min':
          return Math.min(...items.map(item => item[aggregation.field]));
        case 'max':
          return Math.max(...items.map(item => item[aggregation.field]));
      }
    }
  }
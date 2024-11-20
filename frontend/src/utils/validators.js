export const validators = {
    required: (value) => {
      if (value === null || value === undefined || value === '') {
        return 'Este campo es requerido';
      }
      return null;
    },
  
    email: (value) => {
      if (!value) return null;
      const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!regex.test(value)) {
        return 'Email inválido';
      }
      return null;
    },
  
    minLength: (min) => (value) => {
      if (!value) return null;
      if (value.length < min) {
        return `Mínimo ${min} caracteres`;
      }
      return null;
    },
  
    maxLength: (max) => (value) => {
      if (!value) return null;
      if (value.length > max) {
        return `Máximo ${max} caracteres`;
      }
      return null;
    },
  
    numeric: (value) => {
      if (!value) return null;
      if (!/^\d+$/.test(value)) {
        return 'Solo números permitidos';
      }
      return null;
    },
  
    imei: (value) => {
      if (!value) return null;
      if (!/^\d{15}$/.test(value)) {
        return 'IMEI inválido';
      }
      return null;
    },
  
    iccid: (value) => {
      if (!value) return null;
      if (!/^\d{19,20}$/.test(value)) {
        return 'ICCID inválido';
      }
      return null;
    },
  
    validateForm: (values, validations) => {
      const errors = {};
      Object.keys(validations).forEach(field => {
        const value = values[field];
        const fieldValidations = validations[field];
  
        for (const validation of fieldValidations) {
          const error = validation(value);
          if (error) {
            errors[field] = error;
            break;
          }
        }
      });
      return errors;
    }
  };
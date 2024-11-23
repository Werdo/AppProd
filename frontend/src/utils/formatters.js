export const formatters = {
    date: (date) => {
      return new Date(date).toLocaleDateString();
    },
  
    time: (date) => {
      return new Date(date).toLocaleTimeString();
    },
  
    datetime: (date) => {
      return new Date(date).toLocaleString();
    },
  
    number: (num) => {
      return new Intl.NumberFormat().format(num);
    },
  
    currency: (amount) => {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount);
    },
  
    percentage: (value) => {
      return `${(value * 100).toFixed(2)}%`;
    },
  
    fileSize: (bytes) => {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let size = bytes;
      let unitIndex = 0;
  
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
  
      return `${size.toFixed(2)} ${units[unitIndex]}`;
    },
  
    duration: (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    },
  
    serialNumber: (number, length = 8) => {
      return String(number).padStart(length, '0');
    }
  };
  
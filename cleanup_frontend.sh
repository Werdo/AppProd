#!/bin/bash
# cleanup_frontend.sh

# Definir directorio
FRONTEND_DIR="/opt/production_system/AppProd/frontend"

# Limpiar instalación anterior
cd $FRONTEND_DIR
rm -rf node_modules package-lock.json

# Crear nuevo archivo .env
cat > .env << 'EOF'
SKIP_PREFLIGHT_CHECK=true
GENERATE_SOURCEMAP=false
REACT_APP_API_URL=http://localhost:8000/api/v1
EOF

# Crear nuevo package.json con dependencias estables
cat > package.json << 'EOF'
{
  "name": "production-system-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@tanstack/react-query": "4.29.19",
    "@testing-library/jest-dom": "5.16.5",
    "@testing-library/react": "13.4.0",
    "@testing-library/user-event": "13.5.0",
    "@types/jest": "27.5.2",
    "@types/node": "16.18.38",
    "@types/react": "18.2.15",
    "@types/react-dom": "18.2.7",
    "axios": "1.4.0",
    "date-fns": "2.30.0",
    "lucide-react": "0.263.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-router-dom": "6.14.2",
    "react-scripts": "5.0.1",
    "typescript": "4.9.5",
    "web-vitals": "2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "autoprefixer": "10.4.14",
    "postcss": "8.4.26",
    "tailwindcss": "3.3.3"
  }
}

# Crear archivo de configuración de Tailwind
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Crear archivo de configuración de PostCSS
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Instalar dependencias
npm install --legacy-peer-deps

echo "Frontend cleanup completed successfully!"
EOF

chmod +x cleanup_frontend.sh
Last edited just now

#!/bin/bash
# setup_frontend.sh

# Define base directory
BASE_DIR="/opt/production_system/AppProd/frontend"

# Create directory structure
mkdir -p $BASE_DIR/{public,src}
mkdir -p $BASE_DIR/src/{components,pages,services,hooks,utils,contexts}
mkdir -p $BASE_DIR/src/components/{layout,shared,production,dashboard}

# Create index.html
cat > $BASE_DIR/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Production System" />
    <title>Production System</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Create App.tsx
cat > $BASE_DIR/src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
EOF

# Create index.tsx
cat > $BASE_DIR/src/index.tsx << 'EOF'
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# Create routes.tsx
cat > $BASE_DIR/src/routes.tsx << 'EOF'
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductionPage from './pages/ProductionPage';
import BoxManagementPage from './pages/BoxManagementPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/production" element={<ProductionPage />} />
        <Route path="/boxes" element={<BoxManagementPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
EOF

# Create AuthContext
cat > $BASE_DIR/src/contexts/AuthContext.tsx << 'EOF'
import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Aquí puedes decodificar el token y establecer la información del usuario
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
EOF

# Create package.json with updated dependencies
cat > $BASE_DIR/package.json << 'EOF'
{
  "name": "production-system-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@tanstack/react-query": "^5.17.9",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.47",
    "@types/react-dom": "^18.2.18",
    "axios": "^1.6.5",
    "date-fns": "^3.2.0",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.3",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.21.1",
    "recharts": "^2.10.3",
    "typescript": "^5.3.3"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "@typescript-eslint/parser": "^6.18.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.33.2",
    "postcss": "^8.4.33",
    "prettier": "^3.1.1",
    "react-scripts": "5.0.1",
    "tailwindcss": "^3.4.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "GENERATE_SOURCEMAP=false react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
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
  }
}
EOF

# Create index.css with Tailwind
cat > $BASE_DIR/src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Create tailwind.config.js
cat > $BASE_DIR/tailwind.config.js << 'EOF'
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [],
}
EOF

# Create .env file
cat > $BASE_DIR/.env << 'EOF'
REACT_APP_API_URL=http://localhost:8000/api/v1
EOF

# Create tsconfig.json
cat > $BASE_DIR/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
EOF

# Create MainLayout component
mkdir -p $BASE_DIR/src/components/layout
cat > $BASE_DIR/src/components/layout/MainLayout.tsx << 'EOF'
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar aquí */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
EOF

# Create placeholder pages
mkdir -p $BASE_DIR/src/pages
cat > $BASE_DIR/src/pages/LoginPage.tsx << 'EOF'
import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        {/* Formulario aquí */}
      </div>
    </div>
  );
};

export default LoginPage;
EOF

cat > $BASE_DIR/src/pages/DashboardPage.tsx << 'EOF'
import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    </div>
  );
};

export default DashboardPage;
EOF

# Set permissions
chown -R ppelaez:ppelaez $BASE_DIR
chmod -R 755 $BASE_DIR
find $BASE_DIR -type f -exec chmod 644 {} \;

echo "Frontend setup completed successfully!"


# Create .dockerignore
cat > $BASE_DIR/.dockerignore << 'EOF'
node_modules
npm-debug.log
build
.git
.gitignore
README.md
.env
.env.local
EOF

# Create Dockerfile for frontend with optimizations
cat > $BASE_DIR/Dockerfile << 'EOF'
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files and nginx configuration
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

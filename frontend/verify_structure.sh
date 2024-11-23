#!/bin/bash

echo "Verificando estructura de archivos..."

# Verificar directorios
for dir in components/dashboard components/layout components/shared; do
  if [ ! -d "src/$dir" ]; then
    echo "Creando directorio: src/$dir"
    mkdir -p "src/$dir"
  fi
done

# Verificar y crear archivos del dashboard
for file in ProductionMetrics OperatorMetrics QualityMetrics; do
  if [ ! -f "src/components/dashboard/$file.tsx" ]; then
    echo "Creando archivo: src/components/dashboard/$file.tsx"
    touch "src/components/dashboard/$file.tsx"
  fi
done

# Establecer permisos
chmod -R 755 src/
find src/ -type f -exec chmod 644 {} \;

echo "Estructura verificada y corregida"

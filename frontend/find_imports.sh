#!/bin/bash
# find_imports.sh

echo "Buscando todas las importaciones de ProductionMetrics..."
find src -type f -name "*.tsx" -o -name "*.ts" | while read -r file; do
  if grep -l "ProductionMetrics" "$file"; then
    echo "Found in: $file"
    echo "Content:"
    grep -A 1 -B 1 "ProductionMetrics" "$file"
    echo "---"
  fi
done

echo "Verificando rutas de importación..."
grep -r "productionMetrics" src/
echo "---"

echo "Verificando casos de importación..."
grep -r "productionmetrics" src/
echo "---"

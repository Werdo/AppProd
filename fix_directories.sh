#!/bin/bash
# fix_directories.sh

# Define el directorio base
BASE_DIR="/opt/production_system/AppProd/frontend"

# Crear estructura de directorios con nombres en minúsculas
mkdir -p $BASE_DIR/src/components/{dashboard,layout,shared,production}
mkdir -p $BASE_DIR/src/pages
mkdir -p $BASE_DIR/src/hooks
mkdir -p $BASE_DIR/src/services
mkdir -p $BASE_DIR/src/types
mkdir -p $BASE_DIR/src/contexts

# Actualizar las importaciones en los archivos
find $BASE_DIR/src -type f -name "*.tsx" -o -name "*.ts" | while read file; do
    # Reemplazar las rutas con mayúsculas por minúsculas
    sed -i 's/Dashboard/dashboard/g' "$file"
    sed -i 's/Production/production/g' "$file"
    sed -i 's/Layout/layout/g' "$file"
    sed -i 's/Shared/shared/g' "$file"
done

# Establecer permisos
chown -R ppelaez:ppelaez $BASE_DIR/src
chmod -R 755 $BASE_DIR/src

echo "Directory structure has been fixed!"

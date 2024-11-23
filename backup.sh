#!/bin/bash
# backup.sh

# Backup PostgreSQL database
docker-compose exec db pg_dump -U user production > backup/production_$(date +%Y%m%d).sql

# Backup Elasticsearch indices
curl -X PUT "localhost:9200/_snapshot/backup_repository/snapshot_$(date +%Y%m%d)"

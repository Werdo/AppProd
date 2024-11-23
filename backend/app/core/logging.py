import logging
from elasticsearch import Elasticsearch
from app.core.config import settings

es_client = Elasticsearch([settings.ELASTICSEARCH_URL])

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Add Elasticsearch handler
    handler = ElasticsearchHandler(
        es_client=es_client,
        index="production-logs"
    )
    logging.getLogger('').addHandler(handler)

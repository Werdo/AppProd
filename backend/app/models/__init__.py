from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from app.models.ordenes_produccion import OrdenProduccion
from app.models.lotes_produccion import LoteProduccion
from app.models.operarios import Operario
from app.models.versiones_producto import VersionProducto
from app.models.devices import Device

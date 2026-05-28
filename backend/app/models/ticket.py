from sqlalchemy import Column, Integer, String, Text
from pgvector.sqlalchemy import Vector

from app.db.database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(Text, nullable=False)

    priority = Column(String, default="UNKNOWN")

    category = Column(String, default="UNCATEGORIZED")

    status = Column(String, default="OPEN")

    embedding = Column(Vector(1536))

    resolution = Column(Text, nullable=True)
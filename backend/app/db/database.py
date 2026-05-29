
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://admin:password@db:5432/supportflow"
)

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        conn.execute(
            text(
                "CREATE EXTENSION IF NOT EXISTS vector"
            )
        )
        conn.commit()
except Exception as e:
    print("Could not create vector extension:", e)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

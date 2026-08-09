from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker

# This URL tells Python exactly how to find our Docker database
DATABASE_URL = "postgresql://lifeos_user:lifeos_password@db:5432/lifeos_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Here we define the exact columns for our PostgreSQL Table
class TaskDB(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    done = Column(Boolean, default=False)

# This command automatically creates the table inside Postgres!
Base.metadata.create_all(bind=engine)

# A quick helper function to talk to the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
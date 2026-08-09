# init_db.py
from backend.app.db.database import engine, Base
from backend.app.models import domain

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
Set-Content -Path "backend/app/models/domain.py" -Value @"
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.app.db.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    goals = relationship('Goal', back_populates='owner', cascade='all, delete-orphan')

class Goal(Base):
    __tablename__ = 'goals'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship('User', back_populates='goals')
    tasks = relationship('Task', back_populates='goal', cascade='all, delete-orphan')

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, nullable=False)
    is_completed = Column(Boolean, default=False)
    goal_id = Column(UUID(as_uuid=True), ForeignKey('goals.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    goal = relationship('Goal', back_populates='tasks')
"@
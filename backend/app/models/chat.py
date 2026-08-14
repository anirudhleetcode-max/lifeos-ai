from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from backend.app.db.session import Base

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    role = Column(String)  # 'user' or 'ai'
    text = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

class UserAccount(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    user_role = Column(String, default="user") # 'user' or 'admin'
    created_at = Column(DateTime, default=datetime.utcnow)

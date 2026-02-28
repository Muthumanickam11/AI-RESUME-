from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy import JSON
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
	__tablename__ = "users"

	id = Column(Integer, primary_key=True, index=True)
	email = Column(String(255), unique=True, nullable=False, index=True)
	name = Column(String(255), nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

	resumes = relationship("Resume", back_populates="owner")


class Resume(Base):
	__tablename__ = "resumes"

	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
	file_name = Column(String(512), nullable=True)
	text = Column(Text, nullable=False)
	embedding = Column(JSON, nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

	owner = relationship("User", back_populates="resumes")
	matches = relationship("Match", back_populates="resume")


class Job(Base):
	__tablename__ = "jobs"

	id = Column(Integer, primary_key=True, index=True)
	title = Column(String(255), nullable=True)
	description = Column(Text, nullable=False)
	embedding = Column(JSON, nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

	matches = relationship("Match", back_populates="job")


class Match(Base):
	__tablename__ = "matches"

	id = Column(Integer, primary_key=True, index=True)
	resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
	job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
	score = Column(Float, nullable=False)
	missing_keywords = Column(JSON, nullable=True)
	suggestions = Column(JSON, nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

	resume = relationship("Resume", back_populates="matches")
	job = relationship("Job", back_populates="matches")



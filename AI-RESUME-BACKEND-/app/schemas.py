from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ResumeCreate(BaseModel):
	user_email: Optional[str] = None
	file_name: Optional[str] = None
	text: str


class ResumeOut(BaseModel):
	id: int
	user_id: Optional[int]
	file_name: Optional[str]
	created_at: datetime

	class Config:
		from_attributes = True


class JobCreate(BaseModel):
	title: Optional[str] = None
	description: str


class JobOut(BaseModel):
	id: int
	title: Optional[str]
	created_at: datetime

	class Config:
		from_attributes = True


class MatchRequest(BaseModel):
	resume_id: int
	job_id: int


class MatchOut(BaseModel):
	id: int
	resume_id: int
	job_id: int
	score: float
	missing_keywords: Optional[List[str]] = None
	suggestions: Optional[dict] = None
	created_at: datetime

	class Config:
		from_attributes = True


class RankCandidatesRequest(BaseModel):
	job_id: int
	resume_ids: List[int] = Field(default_factory=list)
	limit: int = 10


class RankedCandidate(BaseModel):
	resume_id: int
	score: float
	missing_keywords: Optional[List[str]] = None
	suggestions: Optional[dict] = None


class RankCandidatesResponse(BaseModel):
	job_id: int
	results: List[RankedCandidate]



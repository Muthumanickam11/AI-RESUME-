from typing import Iterable, List, Optional, Sequence, Tuple

from sqlalchemy.orm import Session

from . import models


def get_or_create_user_by_email(db: Session, email: str, name: Optional[str] = None) -> models.User:
	user = db.query(models.User).filter(models.User.email == email).first()
	if user:
		return user
	user = models.User(email=email, name=name)
	db.add(user)
	db.commit()
	db.refresh(user)
	return user


def create_resume(db: Session, *, user_id: Optional[int], file_name: Optional[str], text: str, embedding: Optional[Sequence[float]]) -> models.Resume:
	resume = models.Resume(user_id=user_id, file_name=file_name, text=text, embedding=list(embedding) if embedding is not None else None)
	db.add(resume)
	db.commit()
	db.refresh(resume)
	return resume


def create_job(db: Session, *, title: Optional[str], description: str, embedding: Optional[Sequence[float]]) -> models.Job:
	job = models.Job(title=title, description=description, embedding=list(embedding) if embedding is not None else None)
	db.add(job)
	db.commit()
	db.refresh(job)
	return job


def get_resume(db: Session, resume_id: int) -> Optional[models.Resume]:
	return db.query(models.Resume).filter(models.Resume.id == resume_id).first()


def get_job(db: Session, job_id: int) -> Optional[models.Job]:
	return db.query(models.Job).filter(models.Job.id == job_id).first()


def upsert_match(db: Session, *, resume_id: int, job_id: int, score: float, missing_keywords: Optional[List[str]], suggestions: Optional[dict]) -> models.Match:
	match = (
		db.query(models.Match)
		.filter(models.Match.resume_id == resume_id, models.Match.job_id == job_id)
		.first()
	)
	if match:
		match.score = score
		match.missing_keywords = missing_keywords
		suggestions = suggestions or {}
		match.suggestions = suggestions
	else:
		match = models.Match(
			resume_id=resume_id,
			job_id=job_id,
			score=score,
			missing_keywords=missing_keywords,
			suggestions=suggestions or {},
		)
		db.add(match)
	db.commit()
	db.refresh(match)
	return match



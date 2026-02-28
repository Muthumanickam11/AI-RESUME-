from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas, utils
import tempfile
import os
from ml.utils_text import extract_text, clean_text as clean_text_ml


router = APIRouter()


@router.post("/score", response_model=schemas.MatchOut)
def score_match(payload: schemas.MatchRequest, db: Session = Depends(get_db)):
	resume = crud.get_resume(db, payload.resume_id)
	job = crud.get_job(db, payload.job_id)
	if not resume or not job:
		raise HTTPException(status_code=404, detail="Resume or Job not found")

	if not resume.embedding:
		resume_emb = utils.encode(resume.text)
	else:
		resume_emb = resume.embedding

	if not job.embedding:
		job_emb = utils.encode(job.description)
	else:
		job_emb = job.embedding

	score = utils.cosine_similarity(resume_emb, job_emb)
	job_keywords = utils.extract_top_keywords(job.description)
	missing = utils.diff_keywords(job_keywords, resume.text)
	suggestions = utils.formatting_suggestions(resume.text)

	match = crud.upsert_match(
		db,
		resume_id=resume.id,
		job_id=job.id,
		score=score,
		missing_keywords=missing,
		suggestions=suggestions,
	)
	return match


@router.post("/rank_candidates", response_model=schemas.RankCandidatesResponse)
def rank_candidates(payload: schemas.RankCandidatesRequest, db: Session = Depends(get_db)):
	job = crud.get_job(db, payload.job_id)
	if not job:
		raise HTTPException(status_code=404, detail="Job not found")
	job_emb = job.embedding or utils.encode(job.description)

	results: List[schemas.RankedCandidate] = []
	for resume_id in payload.resume_ids:
		resume = crud.get_resume(db, resume_id)
		if not resume:
			continue
		resume_emb = resume.embedding or utils.encode(resume.text)
		score = utils.cosine_similarity(resume_emb, job_emb)
		job_keywords = utils.extract_top_keywords(job.description)
		missing = utils.diff_keywords(job_keywords, resume.text)
		suggestions = utils.formatting_suggestions(resume.text)
		crud.upsert_match(db, resume_id=resume.id, job_id=job.id, score=score, missing_keywords=missing, suggestions=suggestions)
		results.append(
			schemas.RankedCandidate(
				resume_id=resume.id,
				score=score,
				missing_keywords=missing,
				suggestions=suggestions,
			)
		)

	results.sort(key=lambda r: r.score, reverse=True)
	return schemas.RankCandidatesResponse(job_id=job.id, results=results[: payload.limit])


@router.post("/score-direct")
async def score_direct(
	file: UploadFile = File(...),
	job_text: str = Form(...),
	db: Session = Depends(get_db),
):
	# 1. Process Resume
	content = await file.read()
	with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as tmp:
		tmp.write(content)
		tmp_path = tmp.name
	try:
		resume_text = extract_text(tmp_path)
	finally:
		try:
			os.remove(tmp_path)
		except Exception:
			pass
	
	resume_text = clean_text_ml(resume_text)
	if not resume_text:
		raise HTTPException(status_code=400, detail="Unable to extract text from resume")
	resume_emb = utils.encode(resume_text)

	# 2. Process Job
	job_text = utils.clean_text(job_text)
	if not job_text:
		raise HTTPException(status_code=400, detail="Job text is required")
	job_emb = utils.encode(job_text)

	# 3. Match
	score = utils.cosine_similarity(resume_emb, job_emb)
	job_keywords = utils.extract_top_keywords(job_text)
	missing = utils.diff_keywords(job_keywords, resume_text)
	suggestions = utils.formatting_suggestions(resume_text)

	return {
		"score": score,
		"positives": [kw for kw in job_keywords if kw.lower() in resume_text.lower()][:5], # Simple heuristic for strengths
		"improvements": missing,
		"suggestions": suggestions
	}


@router.post("/rank-direct")
async def rank_direct(
	files: List[UploadFile] = File(...),
	job_text: str = Form(...),
	db: Session = Depends(get_db),
):
	# 1. Process Job
	job_text = utils.clean_text(job_text)
	if not job_text:
		raise HTTPException(status_code=400, detail="Job text is required")
	job_emb = utils.encode(job_text)
	job_keywords = utils.extract_top_keywords(job_text)

	results = []
	for file in files:
		content = await file.read()
		with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as tmp:
			tmp.write(content)
			tmp_path = tmp.name
		try:
			resume_text = extract_text(tmp_path)
		finally:
			try:
				os.remove(tmp_path)
			except Exception:
				pass
		
		resume_text = clean_text_ml(resume_text)
		if not resume_text:
			continue # Skip files that can't be parsed
		
		resume_emb = utils.encode(resume_text)
		score = utils.cosine_similarity(resume_emb, job_emb)
		missing = utils.diff_keywords(job_keywords, resume_text)
		
		results.append({
			"name": file.filename,
			"score": score,
			"missingKeywords": missing
		})

	results.sort(key=lambda x: x["score"], reverse=True)
	return results

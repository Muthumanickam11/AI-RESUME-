from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas, utils


router = APIRouter()


@router.post("/upload", response_model=schemas.JobOut)
def upload_job(payload: schemas.JobCreate, db: Session = Depends(get_db)):
	text = utils.clean_text(payload.description)
	if not text:
		raise HTTPException(status_code=400, detail="Description is required")
	emb = utils.encode(text)
	job = crud.create_job(db, title=payload.title, description=text, embedding=emb)
	return job



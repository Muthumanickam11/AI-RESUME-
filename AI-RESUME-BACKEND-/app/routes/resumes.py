from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas, utils
from ml.utils_text import extract_text, clean_text as clean_text_ml


router = APIRouter()


@router.post("/upload", response_model=schemas.ResumeOut)
async def upload_resume(
	file: UploadFile = File(...),
	user_email: str | None = None,
	db: Session = Depends(get_db),
):
	content = await file.read()
	# Persist temp file to parse with existing extractors
	import tempfile
	with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as tmp:
		tmp.write(content)
		tmp_path = tmp.name
	try:
		text = extract_text(tmp_path)
	finally:
		try:
			import os
			os.remove(tmp_path)
		except Exception:
			pass

	text = clean_text_ml(text)
	if not text:
		raise HTTPException(status_code=400, detail="Unable to extract text from the uploaded resume")

	embedding = utils.encode(text)
	user_id = None
	if user_email:
		user = crud.get_or_create_user_by_email(db, user_email)
		user_id = user.id

	resume = crud.create_resume(db, user_id=user_id, file_name=file.filename, text=text, embedding=embedding)
	return resume



import os
from typing import Optional

try:
	import fitz  # PyMuPDF
except Exception:
	fitz = None

try:
	import docx2txt
except Exception:
	docx2txt = None


def extract_text_from_pdf(file_path: str) -> str:
	if fitz is None:
		raise ImportError("PyMuPDF (fitz) is required to extract text from PDF files.")
	text_parts = []
	with fitz.open(file_path) as doc:
		for page in doc:
			text_parts.append(page.get_text())
	return "\n".join(text_parts)


def extract_text_from_docx(file_path: str) -> str:
	if docx2txt is None:
		raise ImportError("docx2txt is required to extract text from DOCX files.")
	return docx2txt.process(file_path) or ""


def extract_text_from_txt(file_path: str) -> str:
	with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
		return f.read()


def extract_text(file_path: str) -> str:
	"""
	Extract text from PDF, DOCX, or TXT based on file extension.
	"""
	ext = os.path.splitext(file_path)[1].lower()
	if ext == ".pdf":
		return extract_text_from_pdf(file_path)
	if ext in {".docx"}:
		return extract_text_from_docx(file_path)
	if ext in {".txt"}:
		return extract_text_from_txt(file_path)
	raise ValueError(f"Unsupported file extension: {ext}")


def clean_text(text: Optional[str]) -> str:
	if not text:
		return ""
	# Basic normalization
	cleaned = text.replace("\r", "\n")
	cleaned = "\n".join(line.strip() for line in cleaned.splitlines())
	# Collapse multiple newlines
	while "\n\n\n" in cleaned:
		cleaned = cleaned.replace("\n\n\n", "\n\n")
	return cleaned.strip()



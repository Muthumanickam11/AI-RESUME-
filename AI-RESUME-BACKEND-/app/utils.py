import os
from typing import Iterable, List, Optional, Sequence, Tuple

import numpy as np
import torch
from sentence_transformers import SentenceTransformer, util


_MODEL_NAME = os.environ.get("SBERT_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
_DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
_MODEL: Optional[SentenceTransformer] = None


def get_model() -> SentenceTransformer:
	global _MODEL
	if _MODEL is None:
		_MODEL = SentenceTransformer(_MODEL_NAME, device=_DEVICE)
	return _MODEL


def clean_text(text: Optional[str]) -> str:
	if not text:
		return ""
	text = text.replace("\r", "\n")
	text = "\n".join(line.strip() for line in text.splitlines())
	while "\n\n\n" in text:
		text = text.replace("\n\n\n", "\n\n")
	return text.strip()


def encode(text: str) -> List[float]:
	model = get_model()
	emb = model.encode(text, convert_to_tensor=True, normalize_embeddings=True)
	return emb.detach().cpu().tolist()


def cosine_similarity(emb_a: Sequence[float], emb_b: Sequence[float]) -> float:
	a = torch.tensor(emb_a, dtype=torch.float32)
	b = torch.tensor(emb_b, dtype=torch.float32)
	if a.ndim == 1:
		a = a.unsqueeze(0)
	if b.ndim == 1:
		b = b.unsqueeze(0)
	return util.cos_sim(a, b).item()


def extract_top_keywords(text: str, top_k: int = 15) -> List[str]:
	# Simple keyword heuristic: top frequent words excluding stopwords and short tokens
	import re

	stop = {
		"the","and","to","of","in","a","for","with","on","as","is","are","we","our","an","be","by","or","at","from"
	}
	tokens = [t.lower() for t in re.findall(r"[A-Za-z][A-Za-z0-9_+-]{1,}", text)]
	freq = {}
	for t in tokens:
		if len(t) < 3 or t in stop:
			continue
		freq[t] = freq.get(t, 0) + 1
	return [w for w, _ in sorted(freq.items(), key=lambda kv: kv[1], reverse=True)[:top_k]]


def diff_keywords(job_keywords: List[str], resume_text: str) -> List[str]:
	missing = []
	resume_lower = resume_text.lower()
	for kw in job_keywords:
		if kw.lower() not in resume_lower:
			missing.append(kw)
	return missing


def formatting_suggestions(resume_text: str) -> dict:
	sug = {}
	length = len(resume_text.split())
	if length > 1200:
		sug["length"] = "Resume seems long; consider focusing to 1-2 pages."
	if "experience" not in resume_text.lower():
		sug["sections"] = "Consider adding an Experience section."
	return sug



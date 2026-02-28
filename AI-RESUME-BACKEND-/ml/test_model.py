import argparse
import json
import os
from datetime import datetime

import torch
from sentence_transformers import SentenceTransformer, util

from .utils_text import extract_text, clean_text


def load_text(path: str) -> str:
	text = extract_text(path)
	return clean_text(text)


def main():
	parser = argparse.ArgumentParser(description="Test Sentence-BERT similarity between a resume and a job description.")
	parser.add_argument("--resume", type=str, default=os.path.join("ai-resume-matcher", "data", "sample_resumes", "sample_resume.txt"))
	parser.add_argument("--job", type=str, default=os.path.join("ai-resume-matcher", "data", "sample_jobs", "sample_job.txt"))
	parser.add_argument("--model", type=str, default=os.environ.get("SBERT_MODEL", "sentence-transformers/all-MiniLM-L6-v2"))
	parser.add_argument("--output", type=str, default=os.path.join("ai-resume-matcher", "data", "outputs", "test_result.json"))
	args = parser.parse_args()

	resume_text = load_text(args.resume)
	job_text = load_text(args.job)

	if not resume_text:
		raise RuntimeError(f"No text extracted from resume: {args.resume}")
	if not job_text:
		raise RuntimeError(f"No text extracted from job: {args.job}")

	device = "cuda" if torch.cuda.is_available() else "cpu"
	model = SentenceTransformer(args.model, device=device)

	emb_resume = model.encode(resume_text, convert_to_tensor=True, normalize_embeddings=True)
	emb_job = model.encode(job_text, convert_to_tensor=True, normalize_embeddings=True)

	score = util.cos_sim(emb_resume, emb_job).item()

	print(f"Similarity score: {score:.4f}")

	# Persist result
	os.makedirs(os.path.dirname(args.output), exist_ok=True)
	with open(args.output, "w", encoding="utf-8") as f:
		json.dump(
			{
				"timestamp": datetime.utcnow().isoformat() + "Z",
				"resume_path": args.resume,
				"job_path": args.job,
				"model": args.model,
				"similarity": score,
			},
			f,
			ensure_ascii=False,
			indent=2,
		)


if __name__ == "__main__":
	main()



### Overview

Backend built with FastAPI, SQLAlchemy (PostgreSQL), and Sentence-BERT for embeddings.

### Data Model

- `users(id, email, name, created_at)`
- `resumes(id, user_id, file_name, text, embedding, created_at)`
- `jobs(id, title, description, embedding, created_at)`
- `matches(id, resume_id, job_id, score, missing_keywords, suggestions, created_at)`

Embeddings stored as JSON arrays for simplicity. For production, consider vector DBs (PGVector, Qdrant, Pinecone).

### Flow

1) Upload resume (`/resumes/upload`) → extract text (PDF/DOCX/TXT) → encode → store resume and embedding.
2) Upload job (`/jobs/upload`) → clean text → encode → store job and embedding.
3) Match (`/match/score`) → compute cosine similarity; generate missing keywords and formatting suggestions → upsert into `matches`.
4) Rank candidates (`/match/rank_candidates`) → compute scores across given resumes → return ranked list.

### Deployment

Dockerfile builds FastAPI service with model deps. `docker-compose.yml` wires backend + Postgres. Use `DATABASE_URL` env var for connection.



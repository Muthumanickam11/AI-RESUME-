### API Overview

- Base URL: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`

### Endpoints

- `GET /health` — Health check

- `POST /resumes/upload`
  - Form: `file` (PDF/DOCX/TXT), optional `user_email`
  - Response: `{ id, user_id, file_name, created_at }`

- `POST /jobs/upload`
  - JSON: `{ title?, description }`
  - Response: `{ id, title, created_at }`

- `POST /match/score`
  - JSON: `{ resume_id, job_id }`
  - Response: `{ id, resume_id, job_id, score, missing_keywords?, suggestions?, created_at }`

- `POST /match/rank_candidates`
  - JSON: `{ job_id, resume_ids: number[], limit?: number }`
  - Response: `{ job_id, results: [{ resume_id, score, missing_keywords?, suggestions? }] }`



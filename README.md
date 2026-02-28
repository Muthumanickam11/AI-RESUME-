# AI Resume Matcher

An AI-powered application that matches resumes to job descriptions using vector embeddings and similarity scoring.

## Features
- **Resume Upload**: Extract text from PDF/DOCX and generate AI embeddings.
- **Job Matching**: Compare resumes against job descriptions to get match scores.
- **Candidate Ranking**: Rank multiple candidates for a single job post.
- **Feedback & Suggestions**: Get missing keywords and formatting improvements.

## Project Structure
- `AI-RESUME-BACKEND-`: FastAPI backend with SQLAlchemy and Sentence-Transformers.
- `ai-resume-frontend`: Next.js frontend with Tailwind CSS and Radix UI.

## Getting Started

### Backend
1. Navigate to `AI-RESUME-BACKEND-`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Run the server: `uvicorn app.main:app --reload`.

### Frontend
1. Navigate to `ai-resume-frontend`.
2. Install dependencies: `npm install --legacy-peer-deps`.
3. Run the development server: `npm run dev`.

## License
MIT

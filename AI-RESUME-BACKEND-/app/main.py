import os
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from .routes import resumes, jobs, match


def create_app() -> FastAPI:
	app = FastAPI(title="AI Resume Matcher", version="0.1.0")

	# CORS (relaxed defaults for local dev)
	origins = os.environ.get("CORS_ORIGINS", "*").split(",")
	app.add_middleware(
		CORSMiddleware,
		allow_origins=origins,
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)

	app.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
	app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
	app.include_router(match.router, prefix="/match", tags=["match"])

	@app.get("/health")
	def health() -> dict:
		return {"status": "ok"}

	@app.get("/")
	def root() -> dict:
		return {
			"app": "AI Resume Matcher",
			"version": "0.1.0",
			"docs": "/docs",
			"endpoints": [
				"GET /health",
				"POST /resumes/upload",
				"POST /jobs/upload",
				"POST /match/score",
				"POST /match/rank_candidates",
			],
		}

	@app.get("/favicon.ico")
	def favicon() -> Response:
		# No favicon asset; return empty response to avoid 404 spam
		return Response(status_code=204)

	return app


app = create_app()



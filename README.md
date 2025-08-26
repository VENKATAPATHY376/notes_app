# Notes App (React + FastAPI)

## Quick start
1) Backend
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   cp ../.env.example ../.env  # then edit if needed
   uvicorn app.main:app --reload

@echo off
echo =======================================================================
echo  Starting Automated Research Topic Duplication Detection System
echo =======================================================================
echo.

echo Launching FastAPI Backend Server on http://127.0.0.1:8000 ...
start "FastAPI Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --port 8000"

echo Launching React Frontend Server on http://localhost:3000 ...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Launching application in web browser...
timeout /t 3 >nul
start http://localhost:3000

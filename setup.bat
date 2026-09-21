@echo off
echo =======================================================================
echo  Automated Research Topic Duplication Detection Setup Script
echo =======================================================================
echo.

echo [1/2] Installing Python Backend dependencies...
cd backend
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Python dependency installation failed. Please verify Python is in PATH.
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [2/2] Installing Node.js Frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed. Please verify Node.js/npm is installed.
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo =======================================================================
echo  Setup Completed Successfully!
echo  Run 'start.bat' to launch the web application.
echo =======================================================================
pause

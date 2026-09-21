@echo off
echo =======================================================================
echo  Starting Automated Research Topic Duplication Detection (Gradio UI)
echo =======================================================================
echo.
echo Launching Gradio Web Application on http://localhost:7860 ...
start "" http://localhost:7860
python app.py
pause

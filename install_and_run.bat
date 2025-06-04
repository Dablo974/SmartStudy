@echo off
REM SmartStudy Pro - Windows Installer & Launcher
REM -------------------------------------------
REM This script installs project dependencies and runs the NextJS application
REM in development mode.
REM
REM Prerequisites:
REM 1. Git: To clone the repository (if you haven't already).
REM 2. Node.js and npm: This script checks for them but cannot install them.
REM    Download from https://nodejs.org/
REM
REM How to use:
REM 1. Save this file as "install_and_run.bat" in the root directory of the project.
REM 2. Double-click the file or run it from Command Prompt / PowerShell
REM    by navigating to the project's root directory and typing: install_and_run.bat

echo SmartStudy Pro - Windows Installer & Launcher
echo -------------------------------------------
echo.

REM Check for Node.js
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js could not be found.
    echo Please install Node.js and npm before running this script.
    echo You can download Node.js (which includes npm) from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo Node.js found:
    call node -v
)

REM Check for npm
npm -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm (Node Package Manager) could not be found.
    echo Please install Node.js and npm before running this script.
    echo You can download Node.js (which includes npm) from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo npm found:
    call npm -v
)
echo.

REM Navigate to the script's directory (project root)
cd /d "%~dp0"

REM Install dependencies
echo Installing project dependencies using 'npm install'...
echo This might take a few minutes.
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to install project dependencies with 'npm install'.
    echo Please check the error messages above. You might need to troubleshoot network issues,
    echo permissions, or missing system libraries.
    pause
    exit /b 1
) else (
    echo Project dependencies installed successfully.
)
echo.

REM Run the application in development mode
echo Starting the SmartStudy Pro application (npm run dev)...
echo Once started, open your web browser and go to: http://localhost:9002
echo Press Ctrl+C in this window and confirm to stop the application.
call npm run dev

REM This part is reached if 'npm run dev' is stopped
echo.
echo SmartStudy Pro application has been stopped.
echo To run it again, you can use 'install_and_run.bat' (which will skip installation if node_modules exists)
echo or directly run 'npm run dev' in your command prompt.
pause
exit /b 0

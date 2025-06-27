@echo off
REM SmartStudy Pro - Windows Installer & Launcher
REM ---------------------------------------------
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
REM 2. Double-click the file to run it.

echo SmartStudy Pro - Windows Installer & Launcher
echo ---------------------------------------------
echo.

REM Check for Node.js
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js could not be found.
    echo Please install Node.js and npm before running this script.
    echo You can download Node.js (which includes npm) from: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "delims=" %%v in ('node -v') do set NODE_VERSION=%%v
    echo Node.js found: %NODE_VERSION%
)

REM Check for npm
npm -v > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm (Node Package Manager) could not be found.
    echo Please install Node.js and npm before running this script.
    echo You can download Node.js (which includes npm) from: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "delims=" %%v in ('npm -v') do set NPM_VERSION=%%v
    echo npm found: %NPM_VERSION%
)
echo.

REM Check for .env.local file
if not exist ".env.local" (
    echo WARNING: .env.local file not found.
    echo The AI features will not work without a GOOGLE_API_KEY.
    echo Please create a .env.local file with your API key.
    echo Example: GOOGLE_API_KEY=your_api_key_here
    echo.
)

REM Install dependencies
echo Installing project dependencies using 'npm install'...
echo This might take a few minutes.
npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install project dependencies with 'npm install'.
    echo Please check the error messages above. You might need to troubleshoot network issues,
    echo permissions, or missing system libraries.
    pause
    exit /b 1
)
echo Project dependencies installed successfully.
echo.

REM Run the application in development mode
echo Starting the SmartStudy Pro application (npm run dev)...
echo Once started, open your web browser and go to: http://localhost:9002
echo Press Ctrl+C in this terminal to stop the application.
npm run dev

REM This part is reached if 'npm run dev' is stopped
echo.
echo SmartStudy Pro application has been stopped.
echo To run it again, you can use this script or directly run 'npm run dev'.
pause
exit /b 0

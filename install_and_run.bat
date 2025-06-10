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
REM 2. Double-click the file or run it from Command Prompt/PowerShell.

echo SmartStudy Pro - Windows Installer & Launcher
echo -------------------------------------------
echo.

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js could not be found.
    echo Please install Node.js and npm before running this script.
    echo You can download Node.js (which includes npm) from: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo Node.js found: %NODE_VERSION%
)

REM Check for npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm (Node Package Manager) could not be found.
    echo Please install Node.js and npm before running this script.
    echo You can download Node.js (which includes npm) from: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo npm found: %NPM_VERSION%
)
echo.

REM Navigate to the script's directory (project root)
cd /d "%~dp0"

REM Install dependencies
echo Installing project dependencies using "npm install"...
echo This might take a few minutes.
npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install project dependencies with "npm install".
    echo Please check the error messages above. You might need to troubleshoot network issues,
    echo permissions, or missing system libraries.
    pause
    exit /b 1
) else (
    echo Project dependencies installed successfully.
)
echo.

REM Verify Next.js installation
echo Verifying Next.js installation...
IF EXIST "node_modules\.bin\next.cmd" (
    echo Next.js executable found in node_modules.
) ELSE (
    echo ERROR: Next.js executable (node_modules\.bin\next.cmd) not found after 'npm install'.
    echo This might indicate that 'next' was not installed correctly.
    echo Try deleting the 'node_modules' folder and running this script again.
    echo If the problem persists, ensure your 'package.json' lists 'next' as a dependency
    echo and check for errors during the 'npm install' step.
    pause
    exit /b 1
)
echo.

REM Run the application in development mode
echo Starting the SmartStudy Pro application (npm run dev)...
echo Once started, open your web browser and go to: http://localhost:9002
echo Press Ctrl+C in this terminal to stop the application.
npm run dev

REM This part is reached if 'npm run dev' is stopped (e.g., by Ctrl+C or error)
echo.
echo SmartStudy Pro application has been stopped or failed to start.
echo To run it again, you can use "install_and_run.bat"
echo or directly run "npm run dev" from the command line.
pause
exit /b 0

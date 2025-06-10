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

echo SmartStudy Pro - Windows Installer ^& Launcher
echo -------------------------------------------
echo.

REM Function to check if a command exists (simplified for batch)
REM Batch doesn't have direct function definitions like shell scripts.
REM We'll check commands directly where needed.

REM Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js could not be found.
    echo Please install Node.js and npm before running this script.
    echo You can download Node.js (which includes npm) from: https://nodejs.org/
    goto :eof
) else (
    echo Node.js found:
    for /f "delims=" %%v in ('node -v') do echo %%v
)

REM Check for npm
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm (Node PackageManager) could not be found.
    echo Please install Node.js and npm (which is included with Node.js).
    goto :eof
) else (
    echo npm found:
    for /f "delims=" %%v in ('npm -v') do echo %%v
)
echo.

REM Navigate to the script's directory (project root)
REM This ensures npm commands run in the correct context
cd /d "%~dp0"

REM Install dependencies
echo Installing project dependencies using 'npm install'...
echo This might take a few minutes.
npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install project dependencies with 'npm install'.
    echo Please check the error messages above. You might need to troubleshoot network issues,
    echo permissions, or missing system libraries.
    goto :eof
)
echo Project dependencies installed successfully.
echo.

REM Check if next.cmd exists in node_modules\.bin
IF NOT EXIST "node_modules\.bin\next.cmd" (
    echo.
    echo ERROR: 'next.cmd' was not found in node_modules\.bin after 'npm install'.
    echo This suggests that Next.js might not have been installed correctly,
    echo even if 'npm install' did not report an immediate error.
    echo Please try deleting the 'node_modules' folder and run this script again.
    echo If the problem persists, check your npm and Node.js installation.
    goto :eof
)
echo Next.js command found.
echo.


REM Run the application in development mode
echo Starting the SmartStudy Pro application (npm run dev)...
echo Once started, open your web browser and go to: http://localhost:9002
echo Press Ctrl+C in this terminal to stop the application.
npm run dev

REM This part is reached if 'npm run dev' is stopped (e.g., by Ctrl+C)
echo.
echo SmartStudy Pro application has been stopped.
echo To run it again, you can use this script (which will skip installation if node_modules exists and is up-to-date)
echo or directly run 'npm run dev'.

:eof
exit /b

@echo off
setlocal enabledelayedexpansion

:: SmartStudy Pro - Windows Installer & Launcher
:: -------------------------------------------
:: This script installs project dependencies and runs the NextJS application
:: in development mode.
::
:: Prerequisites:
:: 1. Git: To clone the repository (if you haven't already).
:: 2. Node.js and npm: This script checks for them but cannot install them.
::    Download from https://nodejs.org/
::
:: How to use:
:: 1. Save this file as "install_and_run.bat" in the root directory of the project.
:: 2. Double-click the file or run it from Command Prompt/PowerShell.

echo SmartStudy Pro - Windows Installer & Launcher
echo -------------------------------------------
echo.

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js could not be found.
    echo Please install Node.js and npm before running this script.
    echo You can download Node.js (which includes npm^) from: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "delims=" %%i in ('node -v') do set NODE_VERSION=%%i
    echo Node.js found: !NODE_VERSION!
)

:: Check for npm
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm (Node Package Manager) could not be found.
    echo Please install Node.js and npm before running this script.
    echo You can download Node.js (which includes npm^) from: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "delims=" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo npm found: !NPM_VERSION!
)
echo.

:: Navigate to the script's directory (project root)
cd /d "%~dp0"

:: Check for .env.local file and API key
set "API_KEY_PRESENT=false"
if exist ".env.local" (
    findstr /B "GOOGLE_API_KEY=" ".env.local" > nul
    if %errorlevel% equ 0 (
        set "API_KEY_PRESENT=true"
        echo ✓ API key found in .env.local.
    )
)

if "!API_KEY_PRESENT!"=="false" (
    echo WARNING: GOOGLE_API_KEY not found.
    echo The AI features will not work without it.
    set /p "GOOGLE_API_KEY_INPUT=Please enter your Google Gemini API Key and press [Enter]: "
    if defined GOOGLE_API_KEY_INPUT (
        echo GOOGLE_API_KEY=!GOOGLE_API_KEY_INPUT! > .env.local
        echo ✓ API Key saved to .env.local for future use.
        echo.
    ) else (
        echo No API Key provided. AI features will be disabled.
        echo.
    )
)

:: Install dependencies
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

:: Run the application in development mode
echo Starting the SmartStudy Pro application (npm run dev)...
echo Once started, open your web browser and go to: http://localhost:9002
echo Press Ctrl+C in this terminal to stop the application.
npm run dev

:: This part is reached if 'npm run dev' is stopped (e.g., by Ctrl+C)
echo.
echo SmartStudy Pro application has been stopped.
echo To run it again, you can use 'install_and_run.bat'
echo or directly run 'npm run dev'.
pause
exit /b 0

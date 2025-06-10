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
REM 2. Open Command Prompt or PowerShell, navigate to the project's root, and run: .\install_and_run.bat

echo SmartStudy Pro - Windows Installer ^& Launcher
echo -------------------------------------------
echo(

REM Check for Node.js
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js could not be found.
    echo Please install Node.js and npm before running this script.
    echo You can download Node.js (which includes npm) from: https://nodejs.org/
    goto :eof
) ELSE (
    FOR /F "usebackq delims=" %%F IN (`node -v`) DO (SET "NODE_VERSION=%%F")
    echo Node.js found: %NODE_VERSION%
)

REM Check for npm
WHERE npm >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm (Node Package Manager) could not be found.
    echo Please install Node.js and npm before running this script.
    echo You can download Node.js (which includes npm) from: https://nodejs.org/
    goto :eof
) ELSE (
    FOR /F "usebackq delims=" %%F IN (`npm -v`) DO (SET "NPM_VERSION=%%F")
    echo npm found: %NPM_VERSION%
)
echo(

REM Navigate to the script's directory (project root)
REM This ensures npm commands run in the correct context relative to package.json
cd /D "%~dp0"

echo Installing project dependencies using 'npm install'...
echo This might take a few minutes.
npm install
IF %ERRORLEVEL% NEQ 0 (
    echo(
    echo ERROR: Failed to install project dependencies with 'npm install'.
    echo Please check the error messages above. You might need to troubleshoot network issues,
    echo permissions, or missing system libraries like Python or Visual Studio Build Tools (for some native modules).
    goto :eof
)
echo Project dependencies installed successfully.
echo(

REM Check if next.cmd is installed
IF NOT EXIST "node_modules\.bin\next.cmd" (
    echo(
    echo ERROR: Next.js executable (next.cmd) not found in node_modules\.bin after installation.
    echo This might indicate a problem with the 'npm install' process or your npm/Node.js PATH setup.
    echo Please ensure Next.js is listed as a dependency in your package.json and try again.
    echo Also, ensure 'node_modules\.bin' is implicitly or explicitly in your PATH when npm commands are run.
    goto :eof
)
echo Next.js executable found.
echo(

echo Starting the SmartStudy Pro application (npm run dev)...
echo Once started, open your web browser and go to: http://localhost:9002
echo Press Ctrl+C in this terminal to stop the application.
npm run dev

REM This part is reached if 'npm run dev' is stopped (e.g., by Ctrl+C)
echo(
echo SmartStudy Pro application has been stopped.
echo To run it again, you can use '.\install_and_run.bat'
echo or directly run 'npm run dev'.

goto :eof
REM End of script

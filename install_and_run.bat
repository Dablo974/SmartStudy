@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM BatchGotAdmin
:-------------------------------------
REM --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params = %*:"=""
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    SET "PUSHD_OLD_CD=%CD%"
    CD /D "%~dp0"
:--------------------------------------    
CLS

echo SmartStudy Pro - Windows Installer ^& Launcher
echo -------------------------------------------
echo(

REM Check for Node.js
echo Checking for Node.js...
SET "NODE_VERSION="
FOR /F "delims=" %%v IN ('node -v 2^>NUL') DO SET "NODE_VERSION=%%v"

IF "!NODE_VERSION!"=="" (
    WHERE node >NUL 2>&1
    IF ERRORLEVEL 1 (
        GOTO :INSTALL_ERROR_NODE
    ) ELSE (
        echo WARNING: Node.js found, but could not determine version. Will attempt to proceed.
        SET "NODE_VERSION=Unknown (but found)"
    )
)
echo Node.js found: !NODE_VERSION!

REM Check for npm
echo Checking for npm...
SET "NPM_VERSION="
FOR /F "delims=" %%n IN ('npm -v 2^>NUL') DO SET "NPM_VERSION=%%n"

IF "!NPM_VERSION!"=="" (
    WHERE npm >NUL 2>&1
    IF ERRORLEVEL 1 (
        GOTO :INSTALL_ERROR_NPM
    ) ELSE (
        echo WARNING: npm found, but could not determine version. Will attempt to proceed.
        SET "NPM_VERSION=Unknown (but found)"
    )
)
echo npm found: !NPM_VERSION!
echo(

REM Ensure we are in the script's directory (project root)
REM This might be redundant if UAC part sets it, but good as a fallback.
echo Navigating to project root: %~dp0
cd /d "%~dp0"

echo(
echo Installing project dependencies using 'npm install'...
echo This might take a few minutes.
call npm install

REM The output from npm install (including audit) will be shown.
REM Now, verify if next.cmd exists as a more reliable check of successful Next.js installation.
echo(
echo Verifying Next.js installation...
IF NOT EXIST "node_modules\.bin\next.cmd" (
    echo(
    echo ERROR: Next.js command (next.cmd) not found in node_modules\.bin after running 'npm install'.
    echo This indicates a critical problem with dependency installation.
    echo Please check the output of 'npm install' above for errors.
    echo Try deleting the 'node_modules' folder and running this script again.
    PAUSE
    GOTO :END_SCRIPT
)
echo Project dependencies appear to be installed successfully (Next.js command found).

echo(
echo Starting the SmartStudy Pro application (npm run dev)...
echo Once started, open your web browser and go to: http://localhost:9002
echo Press Ctrl+C in this terminal to stop the application.
call npm run dev

echo(
echo SmartStudy Pro application has been stopped.
echo To run it again, you can use this script 
echo or directly run 'npm run dev'.
PAUSE
GOTO :END_SCRIPT

:INSTALL_ERROR_NODE
echo(
echo ERROR: Node.js is required to run this application.
echo Node.js command (node.exe) could not be found or version could not be determined.
echo Please install Node.js (which includes npm) from: https://nodejs.org/
PAUSE
GOTO :END_SCRIPT

:INSTALL_ERROR_NPM
echo(
echo ERROR: npm (Node Package Manager) is required. It's usually installed with Node.js.
echo npm command (npm.cmd) could not be found or version could not be determined.
echo Please ensure Node.js and npm are correctly installed from: https://nodejs.org/
PAUSE
GOTO :END_SCRIPT

:END_SCRIPT
if defined PUSHD_OLD_CD ( popd )
echo(
echo Exiting script.
ENDLOCAL

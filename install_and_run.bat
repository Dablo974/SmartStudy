@echo off
chcp 65001 >nul

echo ------------------------------------------------------------
echo Si nodejs ou npm ne sont pas installé sur votre machine : https://nodejs.org/
echo ------------------------------------------------------------

echo:
echo:

:: Vérification de l'installation de Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Erreur : Node.js n'est pas installé.
    pause
    exit /b 1
)

:: Vérification de l'installation de npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo Erreur : npm n'est pas installé.
    pause
    exit /b 1
)

echo Installation des dépendances...
call npm install
if %errorlevel% neq 0 (
    echo Erreur : %errorlevel% - lors de l'installation des dépendances.
    pause
    exit /b %errorlevel%
)

echo Construction du projet...
call npm run build
if %errorlevel% neq 0 (
    echo Erreur : %errorlevel% - lors de la construction du projet.
    pause
    exit /b %errorlevel%
)

echo Démarrage du projet...
call npm run start
if %errorlevel% neq 0 (
    echo Erreur : %errorlevel% - lors du démarrage du projet.
    pause
    exit /b %errorlevel%
)

echo Le projet a été construit et démarré avec succès.
pause
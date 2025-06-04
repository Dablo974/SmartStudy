#!/bin/bash

# SmartStudy Pro - Linux Installer & Launcher
# -------------------------------------------
# This script installs project dependencies and runs the NextJS application
# in development mode.
#
# Prerequisites:
# 1. Git: To clone the repository (if you haven't already).
# 2. Node.js and npm: This script checks for them but cannot install them.
#    Download from https://nodejs.org/
#
# How to use:
# 1. Save this file as "install_and_run.sh" in the root directory of the project.
# 2. Open your terminal in the project's root directory.
# 3. Make the script executable: chmod +x install_and_run.sh
# 4. Run the script: ./install_and_run.sh

echo "SmartStudy Pro - Linux Installer & Launcher"
echo "-------------------------------------------"
echo ""

# Function to check if a command exists
command_exists () {
    command -v "$1" &> /dev/null ;
}

# Check for Node.js
if ! command_exists node; then
    echo "ERROR: Node.js could not be found."
    echo "Please install Node.js and npm before running this script."
    echo "You can download Node.js (which includes npm) from: https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo "Node.js found: $NODE_VERSION"
fi

# Check for npm
if ! command_exists npm; then
    echo "ERROR: npm (Node Package Manager) could not be found."
    echo "Please install Node.js and npm before running this script."
    echo "You can download Node.js (which includes npm) from: https://nodejs.org/"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo "npm found: $NPM_VERSION"
fi
echo ""

# Navigate to the script's directory (project root)
# This ensures npm commands run in the correct context
cd "$(dirname "$0")" || exit

# Install dependencies
echo "Installing project dependencies using 'npm install'..."
echo "This might take a few minutes."
if npm install; then
    echo "Project dependencies installed successfully."
else
    echo ""
    echo "ERROR: Failed to install project dependencies with 'npm install'."
    echo "Please check the error messages above. You might need to troubleshoot network issues,"
    echo "permissions, or missing system libraries."
    exit 1
fi
echo ""

# Run the application in development mode
echo "Starting the SmartStudy Pro application (npm run dev)..."
echo "Once started, open your web browser and go to: http://localhost:9002"
echo "Press Ctrl+C in this terminal to stop the application."
npm run dev

# This part is reached if 'npm run dev' is stopped (e.g., by Ctrl+C)
echo ""
echo "SmartStudy Pro application has been stopped."
echo "To run it again, you can use './install_and_run.sh' (which will skip installation if node_modules exists)"
echo "or directly run 'npm run dev'."
exit 0

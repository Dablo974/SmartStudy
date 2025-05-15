# Firebase Studio

This is a NextJS starter in Firebase Studio.

Prerequisites (Same for Linux and Windows)

Node.js and npm:
Ensure you have Node.js installed. The LTS (Long-Term Support) version is generally recommended. You can download it from nodejs.org.
npm (Node Package Manager) is included with Node.js. You can verify installations by opening your terminal/command prompt and typing:
node -v
npm -v
Git:
If you're cloning the project from GitHub, you'll need Git. Download from git-scm.com.

II. Getting the App and Running It

The following steps assume you have your project code either locally or on GitHub.

Open Your Terminal/Command Prompt:

Linux: Open your preferred terminal (e.g., GNOME Terminal, Konsole, xterm, etc.).
Windows: Open Command Prompt (search for cmd) or PowerShell (search for PowerShell).
Navigate to Your Project Directory:

If you already have the project files locally, just navigate into the project's root folder (the one containing package.json):
cd path/to/your/project-directory
Install Dependencies: This command reads your package.json file and downloads all the necessary packages (like Next.js, React, ShadCN components, etc.) into a node_modules folder.

npm install
(If you prefer using yarn or pnpm, you'd use yarn install or pnpm install respectively, assuming you have them installed.)

Run the App in Development Mode: Your package.json has a dev script: "dev": "next dev --turbopack -p 9002". This command starts the Next.js development server.

npm run dev
This will compile your application and start a server, usually on port 9002 as specified in your script.
You'll see output in the terminal, typically indicating the server is ready, e.g., ready - started server on 0.0.0.0:9002, url: http://localhost:9002.
Open your web browser and go to http://localhost:9002 to see your app.
The development server provides features like Hot Module Replacement (HMR), so changes you make to the code will automatically update in the browser.
Building and Running for Production (Optional, for deployment or testing production build):

a. Build the App: This command creates an optimized production build of your application in the .next folder. bash npm run build

b. Start the Production Server: This command starts a server that serves your optimized production build. bash npm run start * This server usually runs on port 3000 by default, unless configured otherwise in your Next.js settings or via command-line arguments (your start script in package.json is just next start, so it would use the default). * Open your web browser and go to http://localhost:3000 (or the port indicated in the terminal).

III. Key Differences & Notes:

Terminal Commands: The actual npm commands (npm install, npm run dev, npm run build, npm run start) are identical on both Linux and Windows.
Environment Variables: If your app later uses environment variables (e.g., for API keys in .env.local), the way you set system-wide environment variables differs between Linux and Windows, but Next.js's built-in environment variable handling (loading from .env* files) works consistently across both.
File Paths: Be mindful of file path differences (e.g., / in Linux vs. \ in Windows) if you ever hardcode paths, but Node.js and Next.js generally handle this well.
Genkit Server: Your package.json also includes scripts like genkit:dev. This is for running the Genkit development server, typically for AI-related backend flows. It runs independently of the Next.js frontend server and usually in a separate terminal. To just "launch the app" as a user would see it, npm run dev is the primary command.
So, in summary:

Install Node.js.
Open terminal/cmd.
Navigate to project folder.
npm install
npm run dev (and open http://localhost:9002 in your browser).

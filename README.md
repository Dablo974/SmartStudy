
# SmartStudy Pro - NextJS MCQ Learning Platform

This is a NextJS application designed as an intelligent MCQ learning platform with spaced repetition.

## I. Prerequisites (Same for Linux & Windows)

1.  **Node.js and npm:**
    *   Ensure you have Node.js installed. The LTS (Long-Term Support) version is generally recommended. You can download it from [nodejs.org](https://nodejs.org/).
    *   npm (Node Package Manager) is included with Node.js. You can verify the installations by opening your terminal/command prompt and typing:
        ```bash
        node -v
        npm -v
        ```

2.  **Git:**
    *   If you are cloning the project from GitHub (which is recommended), you will need Git. Download it from [git-scm.com](https://git-scm.com/).

## II. Getting and Running the Application

The following steps assume you have the project code either locally or on GitHub.

### A. Simplified Method with Scripts (Recommended)

Scripts have been provided to simplify dependency installation and launching the application. **This is the recommended method as it handles everything for you.**

**For Linux:**

1.  Open your terminal.
2.  Navigate to your project's root directory.
3.  Make the script executable (only the first time):
    ```bash
    chmod +x install_and_run.sh
    ```
4.  Run the script:
    ```bash
    ./install_and_run.sh
    ```

**For Windows:**

1.  Open File Explorer and navigate to your project's root directory.
2.  Double-click the `install_and_run.bat` file.
    *   Alternatively, open a Command Prompt or PowerShell, navigate to the project directory, and run:
        ```bash
        .\install_and_run.bat
        ```

**API Key Setup:**
The first time you run the script, it will check if it needs an API key for the AI features. If so, it will prompt you to enter it directly in the terminal. The key will be securely saved in a `.env.local` file for future use.

Once the application is started by the script, open your web browser and go to `http://localhost:9002`.

### B. Manual Method

If you prefer not to use the scripts, you can follow these steps.

1.  **Open your Terminal/Command Prompt.**
2.  **Navigate to the Project Directory.**
3.  **Configure your API Key (Crucial Step):** Create a file named `.env.local` in the project root and add your Google Gemini API key. (See section `IV. API Key Configuration` below for details).
4.  **Install Dependencies:**
    ```bash
    npm install
    ```
5.  **Run the Application in Development Mode:**
    ```bash
    npm run dev
    ```
    *   The server will start on `http://localhost:9002`.

## III. Key Differences & Notes:

*   **Terminal Commands:** The actual `npm` commands (`npm install`, `npm run dev`) are identical on Linux and Windows.
*   **Environment Variables:** Using a `.env.local` file is the standard method and works identically on all operating systems with Next.js. You do not need to use the `export` or `set` command in your terminal.

## IV. API Key Configuration (Important for Security)

The application uses the Google Gemini API for its artificial intelligence features.

**Your API key is SECURE.** It is used only on the server and is never exposed to the user's browser.

To configure your key for local development, the easiest method is to use the launch scripts (`install_and_run.sh` or `install_and_run.bat`). If the key is not configured, the script will ask you to enter it and will save it for you in a `.env.local` file.

This `.env.local` file is ignored by Git and will therefore never be shared. It will contain a line like this:
```
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
(Replace `YOUR_GEMINI_API_KEY_HERE` with the key you obtained from [Google AI Studio](https://aistudio.google.com/app/apikey)).

Once the file is created, restart your development server for Next.js to pick up the new environment variable.

## V. Creating MCQs

1.  You can upload an MCQ set in CSV format directly in the app.
2.  You can create your own MCQs in the app and then save them as a .csv file.
3.  You can generate MCQs via AI by uploading a course in PDF format.

To facilitate your revisions, I recommend giving your course material to an LLM (ChatGPT, Mistral, Gemini, etc.) with the following prompt:
"create an mcq in csv format following this structure:
question,option1,option2,option3,option4,correctAnswerIndex,subject,explanation
Be as exhaustive as possible and use 1-based indexing for the correct answer."

Feel free to manually add questions if necessary.

## VI. Deployment on Vercel (Free)

The easiest way to deploy this application for free is by using Vercel.

### Prerequisites
*   A [GitHub](https://github.com/), [GitLab](https://gitlab.com/), or [Bitbucket](https://bitbucket.org/) account.
*   Your application code pushed to a repository on one of these platforms.

### Step-by-Step Guide

1.  **Sign Up/Log In to Vercel**: Go to [vercel.com](https://vercel.com/) and create an account. It's easiest to sign up with your Git provider account.

2.  **Import Your Project**:
    *   From your Vercel dashboard, click **"Add New..." -> "Project"**.
    *   Find your project repository and click the **"Import"** button next to it.

3.  **Configure Your Project**:
    *   Vercel will automatically detect that you're using Next.js and will pre-fill all the correct build settings. You don't need to change anything here.
    *   The most important step is to add your API key.

4.  **Add Environment Variable**:
    *   Expand the **"Environment Variables"** section.
    *   Add a new variable:
        *   **Name**: `GOOGLE_API_KEY`
        *   **Value**: Paste the API key you got from Google AI Studio.
    *   Make sure the variable is available for all environments (Production, Preview, Development).
    *   Click **"Add"**.

5.  **Deploy**:
    *   Click the **"Deploy"** button.
    *   Vercel will now build and deploy your application. In a few minutes, you'll have a live URL to access your app!

### Important Note for the Free Plan
Vercel's free "Hobby" plan has a **10-second execution limit** for server-side functions. The AI generation from a PDF can sometimes take longer than this, especially for large documents. If you encounter errors with large PDFs, this is likely the cause. For most use cases, it should work perfectly.

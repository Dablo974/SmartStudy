
# SmartStudy Pro - NextJS MCQ Learning Platform

This is a NextJS application designed as an intelligent MCQ learning platform with spaced repetition.

## I. Prérequis (Identiques pour Linux et Windows)

1.  **Node.js et npm :**
    *   Assurez-vous d'avoir installé Node.js. La version LTS (Long-Term Support) est généralement recommandée. Vous pouvez la télécharger sur [nodejs.org](https://nodejs.org/).
    *   npm (Node Package Manager) est inclus avec Node.js. Vous pouvez vérifier les installations en ouvrant votre terminal/invite de commandes et en tapant :
        ```bash
        node -v
        npm -v
        ```

2.  **Git :**
    *   Si vous clonez le projet depuis GitHub (ce qui est recommandé), vous aurez besoin de Git. Téléchargez-le sur [git-scm.com](https://git-scm.com/).

## II. Obtenir l'Application et la Lancer

Les étapes suivantes supposent que vous avez le code de votre projet soit localement, soit sur GitHub.

### A. Méthode Simplifiée avec Scripts (Recommandé)

Des scripts ont été fournis pour simplifier l'installation des dépendances et le lancement de l'application. **C'est la méthode recommandée car elle gère tout pour vous.**

**Pour Linux :**

1.  Ouvrez votre terminal.
2.  Naviguez vers le répertoire racine de votre projet.
3.  Rendez le script exécutable (seulement la première fois) :
    ```bash
    chmod +x install_and_run.sh
    ```
4.  Exécutez le script :
    ```bash
    ./install_and_run.sh
    ```
    Ce script vérifiera les prérequis (Node.js, npm), vous rappellera de créer le fichier `.env.local` si nécessaire, installera les dépendances (`npm install`) et lancera ensuite l'application (`npm run dev`).

**Pour Windows :**

1.  Ouvrez l'Explorateur de Fichiers et naviguez vers le répertoire racine de votre projet.
2.  Double-cliquez sur le fichier `install_and_run.bat`.
    *   Alternativement, ouvrez une Invite de Commandes ou PowerShell, naviguez vers le répertoire du projet, et exécutez :
        ```bash
        .\install_and_run.bat
        ```
    Ce script vérifiera les prérequis (Node.js, npm), vous rappellera de créer le fichier `.env.local` si nécessaire, installera les dépendances (`npm install`) et lancera ensuite l'application (`npm run dev`).

Une fois l'application lancée par le script, ouvrez votre navigateur web et allez à `http://localhost:9002`.

### B. Méthode Manuelle

Si vous préférez ne pas utiliser les scripts, vous pouvez suivre ces étapes.

1.  **Ouvrez votre Terminal/Invite de Commandes :**
    *   **Linux :** Ouvrez votre terminal préféré.
    *   **Windows :** Ouvrez l'Invite de Commandes ou PowerShell.

2.  **Naviguez vers le Répertoire de Votre Projet :**
    *   Si vous avez cloné le projet depuis GitHub :
        ```bash
        git clone <URL_DE_VOTRE_REPOSITORY_GITHUB>
        cd <NOM_DE_VOTRE_REPOSITORY>
        ```
    *   Si vous avez déjà les fichiers, naviguez simplement dans le dossier racine du projet.
        ```bash
        cd chemin/vers/votre/repertoire-projet
        ```

3.  **Installez les Dépendances :**
    ```bash
    npm install
    ```

4.  **Configurez votre Clé API (Étape cruciale)**
    *   Avant de lancer l'application, créez un fichier nommé `.env.local` à la racine du projet.
    *   Ajoutez votre clé API Google Gemini dans ce fichier. (Voir la section `IV. Configuration des Clés API` ci-dessous pour les détails).

5.  **Lancez l'Application en Mode Développement :**
    ```bash
    npm run dev
    ```
    *   Le serveur démarrera sur `http://localhost:9002`.

## III. Différences Clés & Notes :

*   **Commandes Terminal :** Les commandes `npm` réelles (`npm install`, `npm run dev`) sont identiques sur Linux et Windows.
*   **Variables d'Environnement :** L'utilisation d'un fichier `.env.local` est la méthode standard et fonctionne de manière identique sur tous les systèmes d'exploitation avec Next.js. Vous n'avez pas besoin d'utiliser la commande `export` ou `set` dans votre terminal.
*   **Serveur Genkit :** Pour simplement lancer l'application, `npm run dev` ou les scripts `install_and_run` sont les commandes principales.

## IV. Configuration des Clés API (Important pour la Sécurité)

L'application utilise l'API Google Gemini pour les fonctionnalités d'intelligence artificielle. Pour que cela fonctionne, vous devez fournir votre propre clé API.

**Votre clé API est SÉCURISÉE.** Elle est utilisée uniquement sur le serveur et n'est jamais exposée au navigateur de l'utilisateur.

Pour configurer votre clé pour le développement local :

1.  **Créez un fichier `.env.local`** à la racine de votre projet (au même niveau que `package.json`). Ce fichier est ignoré par Git et ne sera donc jamais partagé.

2.  **Ajoutez votre clé API** dans ce fichier comme ceci :
    ```
    GOOGLE_API_KEY=VOTRE_CLE_API_GEMINI_ICI
    ```
    (Remplacez `VOTRE_CLE_API_GEMINI_ICI` par la clé que vous avez obtenue depuis [Google AI Studio](https://aistudio.google.com/app/apikey)).

3.  **Redémarrez votre serveur de développement** (`npm run dev` ou en utilisant les scripts) pour que Next.js prenne en compte la nouvelle variable d'environnement.

## V. Création de QCMs

1. Vous pouvez charger un qcm en format csv directement dans l'app
2. Vous pouvez créer vous même vos qcms dans l'app puis les enrgistrer en .csv
3. Vous pouvez générer des QCMs via l'IA en téléversant un cours au format PDF.

Afin de vous faciliter vos révisions je vous conseil de donner votre cours à un LLM (chat gpt, mistral, gemini ...) avec le prompt suivant:
"fais un qcm en format csv suivant le format suivant: 
question,option1,option2,option3,option4,correctAnswerIndex,subject,explanation
Sois le plus exhaustif possible et index les réponses à 1."

Il ne faut pas hésiter à ajouter manuellement des questions si nécessaire.

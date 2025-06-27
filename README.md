
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

Des scripts ont été fournis pour simplifier l'installation des dépendances et le lancement de l'application.

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
    Ce script vérifiera les prérequis (Node.js, npm), installera les dépendances (`npm install`) et lancera ensuite l'application (`npm run dev`).

**Pour Windows :**

1.  Ouvrez l'Explorateur de Fichiers et naviguez vers le répertoire racine de votre projet.
2.  Double-cliquez sur le fichier `install_and_run.bat`.
    *   Alternativement, ouvrez une Invite de Commandes ou PowerShell, naviguez vers le répertoire du projet, et exécutez :
        ```bash
        .\install_and_run.bat
        ```
    Ce script vérifiera les prérequis (Node.js, npm), installera les dépendances (`npm install`) et lancera ensuite l'application (`npm run dev`).

Une fois l'application lancée par le script, ouvrez votre navigateur web et allez à `http://localhost:9002`.

### B. Méthode Manuelle

1.  **Ouvrez votre Terminal/Invite de Commandes :**
    *   **Linux :** Ouvrez votre terminal préféré (par exemple, GNOME Terminal, Konsole, xterm, etc.).
    *   **Windows :** Ouvrez l'Invite de Commandes (recherchez `cmd`) ou PowerShell (recherchez `PowerShell`).

2.  **Naviguez vers le Répertoire de Votre Projet :**
    *   Si vous avez cloné le projet depuis GitHub :
        ```bash
        git clone <URL_DE_VOTRE_REPOSITORY_GITHUB>
        cd <NOM_DE_VOTRE_REPOSITORY>
        ```
        (Remplacez `<URL_DE_VOTRE_REPOSITORY_GITHUB>` et `<NOM_DE_VOTRE_REPOSITORY>` par les informations correspondantes.)
    *   Si vous avez déjà les fichiers du projet localement, naviguez simplement dans le dossier racine du projet (celui contenant `package.json`) :
        ```bash
        cd chemin/vers/votre/repertoire-projet
        ```

3.  **Installez les Dépendances :**
    Cette commande lit votre fichier `package.json` et télécharge tous les paquets nécessaires (comme Next.js, React, les composants ShadCN, etc.) dans un dossier `node_modules`.
    ```bash
    npm install
    ```
    *(Si vous préférez utiliser `yarn` ou `pnpm`, vous utiliseriez `yarn install` ou `pnpm install` respectivement, en supposant que vous les ayez installés.)*

4.  **Lancez l'Application en Mode Développement :**
    Votre `package.json` contient un script `dev` : `"dev": "next dev -p 9002"`. Cette commande démarre le serveur de développement Next.js.
    ```bash
    npm run dev
    ```
    *   Cela compilera votre application et démarrera un serveur, généralement sur le port `9002` comme spécifié dans votre script.
    *   Vous verrez une sortie dans le terminal, indiquant typiquement que le serveur est prêt, par exemple : `ready - started server on 0.0.0.0:9002, url: http://localhost:9002`.
    *   Ouvrez votre navigateur web et allez à `http://localhost:9002` pour voir votre application.
    *   Le serveur de développement fournit des fonctionnalités comme le Hot Module Replacement (HMR), donc les changements que vous apportez au code se mettront automatiquement à jour dans le navigateur.

5.  **Compiler et Lancer pour la Production (Optionnel, pour le déploiement ou tester la version de production) :**

    a.  **Compilez l'Application :**
        Cette commande crée une version optimisée pour la production de votre application dans le dossier `.next`.
        ```bash
        npm run build
        ```

    b.  **Démarrez le Serveur de Production :**
        Cette commande démarre un serveur qui sert votre version de production optimisée.
        ```bash
        npm run start
        ```
        *   Ce serveur fonctionne généralement sur le port `3000` par défaut, sauf configuration contraire dans vos paramètres Next.js ou via des arguments en ligne de commande (votre script `start` dans `package.json` est juste `next start`, il utiliserait donc la valeur par défaut).
        *   Ouvrez votre navigateur web et allez à `http://localhost:3000` (ou le port indiqué dans le terminal).

## III. Différences Clés & Notes :

*   **Commandes Terminal :** Les commandes `npm` réelles (`npm install`, `npm run dev`, `npm run build`, `npm run start`) sont identiques sur Linux et Windows.
*   **Variables d'Environnement :** Si votre application utilise ultérieurement des variables d'environnement (par exemple, pour des clés API dans `.env.local`), la manière de définir les variables d'environnement à l'échelle du système diffère entre Linux et Windows, mais la gestion intégrée des variables d'environnement de Next.js (chargement depuis les fichiers `.env*`) fonctionne de manière cohérente sur les deux.
*   **Chemins de Fichiers :** Soyez conscient des différences de chemins de fichiers (par exemple, `/` sous Linux vs. `\` sous Windows) si vous codez en dur des chemins, mais Node.js et Next.js gèrent généralement bien cela.
*   **Serveur Genkit :** Votre `package.json` inclut également des scripts comme `genkit:dev`. Ceci est pour exécuter le serveur de développement Genkit, typiquement pour les flux backend liés à l'IA. Il fonctionne indépendamment du serveur frontend Next.js et généralement dans un terminal séparé. Pour simplement "lancer l'application" comme un utilisateur la verrait, `npm run dev` ou les scripts `install_and_run` sont les commandes principales.

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

3.  **Redémarrez votre serveur de développement** (`npm run dev`) pour que Next.js prenne en compte la nouvelle variable d'environnement.

## V. Création de QCMs

1. Vous pouvez charger un qcm en format csv directement dans l'app
2. Vous pouvez créer vous même vos qcms dans l'app puis les enrgistrer en .csv
3. Vous pouvez générer des QCMs via l'IA en téléversant un cours au format PDF.

Afin de vous faciliter vos révisions je vous conseil de donner votre cours à un LLM (chat gpt, mistral, gemini ...) avec le prompt suivant:
"fais un qcm en format csv suivant le format suivant: 
question,option1,option2,option3,option4,correctAnswerIndex,subject,explanation
Sois le plus exhaustif possible et index les réponses à 1."

Il ne faut pas hésiter à ajouter manuellement des questions si nécessaire.

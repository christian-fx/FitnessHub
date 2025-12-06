# Fitness Hub

Fitness Hub is a modern, AI-powered web application designed to help users achieve their fitness goals. It provides personalized workout plans, progress tracking, and social challenges to keep users motivated and engaged.

![Fitness Hub Screenshot](https://storage.googleapis.com/stabl-prod-golden-screenshot/screenshot-clz7v358t0002123512p3a90u.png)

## Core Features

-   **AI Workout Recommendations**: Leverages generative AI to create personalized workout routines based on user goals, fitness level, and available equipment.
-   **Custom Workout Plans**: A library of pre-built workout plans for various goals like strength training, cardio, and flexibility.
-   **Interactive Workout Sessions**: Start a workout and follow along with timers for each exercise, creating an interactive training experience.
-   **Progress Tracking Dashboard**: A comprehensive dashboard visualizing key metrics like total workouts, calories burned, volume lifted, and active streak.
-   **Data Visualization**: Includes charts and graphs to monitor workout history and progress overview across different fitness categories.
-   **Social Fitness Challenges**: Users can join community challenges to stay motivated and compete with others.
-   **User Authentication**: Secure user sign-up and login with email/password and Google, built on Firebase Authentication.
-   **Data Persistence**: All user data, including workout logs and profile information, is stored securely in Firestore.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
-   **AI/Generative**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Charts**: [Recharts](https://recharts.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or newer recommended)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/fitness-hub.git
    cd fitness-hub
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a file named `.env` in the root of your project and add your Google AI API key. This is required for the AI workout recommendation feature to work.
    ```
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```
    You can obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Firebase Setup

This project is configured to work with Firebase.

-   **Authentication**: The app uses Firebase Authentication for user management. The sign-up and login flows are pre-configured.
-   **Firestore**: User profiles and workout data are stored in Firestore. The necessary data structures are created automatically for new users.

To connect this project to your own Firebase project, you will need to:
1.  Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new Web App in your Firebase project settings.
3.  Copy the `firebaseConfig` object provided by Firebase.
4.  Replace the contents of `src/firebase/config.ts` with your own configuration object.

## Deployment

This application is ready to be deployed on platforms like Vercel, Netlify, or Firebase App Hosting.

### Deploying on Vercel

When deploying to Vercel, you must add the `GEMINI_API_KEY` to your project's environment variables to ensure the AI features work in production.

1.  Push your code to a GitHub repository.
2.  Import the repository into Vercel.
3.  In the project settings in Vercel, navigate to **Settings > Environment Variables**.
4.  Add `GEMINI_API_KEY` and paste your API key as the value.
5.  Redeploy the application for the changes to take effect.

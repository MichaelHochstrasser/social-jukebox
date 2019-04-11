export const FRONTEND_BASE_URL = process.env.NODE_ENV === "production" ? "https://social-jukebox-zuehlke.firebaseapp.com" : "http://localhost:3000";

export const BACKEND_BASE_URL = process.env.NODE_ENV === "production" ? "https://us-central1-social-jukebox-zuehlke.cloudfunctions.net" : "http://localhost:5000/social-jukebox-zuehlke/us-central1";
import * as firebase from 'firebase';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "social-jukebox-zuehlke.firebaseapp.com",
    databaseURL: "https://social-jukebox-zuehlke.firebaseio.com",
    projectId: "social-jukebox-zuehlke",
    storageBucket: "social-jukebox-zuehlke.appspot.com",
    messagingSenderId: "972938474412"
};

firebase.initializeApp(config);

export default firebase;
// Firebase Configuration
// This file should be loaded before app.js
const firebaseConfig = {
    apiKey: "AIzaSyC-BPfyBdHe6maA_W_0iSn9rRN9r3J74UQ",
    authDomain: "saferide-peld8.firebaseapp.com",
    projectId: "saferide-peld8",
    storageBucket: "saferide-peld8.firebasestorage.app",
    messagingSenderId: "610769160211",
    appId: "1:610769160211:android:fd5f504328097089cfd7e6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other modules
window.firebaseConfig = firebaseConfig;
window.auth = auth;
window.db = db;

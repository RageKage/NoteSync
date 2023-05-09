import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/router";
import dotenv from 'dotenv';




const app = createApp(App);




// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "banksetup-8d053.firebaseapp.com",
  projectId: "banksetup-8d053",
  storageBucket: "banksetup-8d053.appspot.com",
  messagingSenderId: "301161007204",
  appId: "1:301161007204:web:030d2521e5fe13235c3771",
};

// dotenv.config();


// Initialize the Firebase app with the configured credentials
initializeApp(firebaseConfig);

// Use the Pinia state management library
app.use(createPinia());

// Use the router instance
app.use(router);

// Mount the app to the DOM
app.mount("#app");

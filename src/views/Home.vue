<template>
  <div class="container">
    <header>
      <img src="../assets/notebooknd-shop.jpeg" alt="NoteSync" />
      <h1>Welcome to NoteSync!</h1>
      <p>
        A place to capture your thoughts and ideas in one place that is easily
        accessible.
      </p>
    </header>
    <div class="content">
      <div class="left">
        <h2>Key Features</h2>
        <p>
          Note-taking web app, designed for seamless and secure organization of
          your personal notes!
        </p>
        <ul>
          <li>🚀 Key features:</li>
          <li>✍️ Create, read, update, and delete notes with ease</li>
          <li>
            🔄 Real-time data synchronization with Firebase Realtime Database
          </li>
          <li>🔒 Secure user sign-up and sign-in using Google OAuth</li>
          <li>🌐 Responsive design for a great experience on any device</li>
          <li>🔗 Easily share your notes with fellow users</li>
        </ul>
        <p>
          Developed with Vue.js, Firebase, and Vite, the app also leverages
          GitHub Actions for continuous integration and deployment to Firebase
          Hosting, ensuring smooth updates. As this is the beta testing phase,
          I'd love to hear your feedback on the app's functionality and any
          areas for improvement.
        </p>
        <p>
          Created by Niman Ahmed. Contact me at
          <a href="mailto:notesyncservice@gmail.com" class="email"
            >notesyncservice@gmail.com</a
          >
          with any questions or feedback!
        </p>
      </div>
      <div class="right">
        <div class="signed-in" v-if="!signedIn">
          <p>
            Get started and start capturing your thoughts, ideas, and
            inspirations!
          </p>
          <router-link to="/register" class="sign-up">
            Sign up Now!
          </router-link>
        </div>
        <div class="signed-in" v-if="signedIn">
          <p>
            Stay tuned! I will be adding more features like a reminder and
            sharing with friends.
          </p>
          <router-link to="/new-note" class="sign-up">
            Start Writing!
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { getAuth, signOut as signOutFirebase } from "firebase/auth";
import router from "../router/router";
import { useRoute } from "vue-router";
import "../assets/components_CSS/home.css"

const auth = getAuth();
const signedIn = ref(false);

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      signedIn.value = true; // Set signedIn to true if the user is signed in
    } else {
      signedIn.value = false; // Set signedIn to false if the user is signed out
    }
  });
});
</script>


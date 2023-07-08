<template>
  <div class="main-container">
    <div class="content-container">
      <header class="header-section">
        <img
          class="logo-image"
          src="../assets/pngfind.com-indiana-outline-png-2131193.png"
          alt="NoteSync"
        />
        <h1 class="main-title">Welcome to NoteSync!</h1>
        <p class="main-description">
          A place to capture your thoughts and ideas in one place that is easily
          accessible.
        </p>
      </header>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Left Section -->
        <div class="left-section">
          <h2 class="section-title">Key Features</h2>
          <p class="section-description">
            Note-taking web app, designed for seamless and secure organization
            of your personal notes!
          </p>
          <ul class="features-list">
            <li class="feature-item">🚀 Key features:</li>
            <li class="feature-item">
              ✍️ Create, read, update, and delete notes with ease
            </li>
            <li class="feature-item">
              🔄 Real-time data synchronization with Firebase Realtime Database
            </li>
            <li class="feature-item">
              🔒 Secure user sign-up and sign-in using Google OAuth
            </li>
            <li class="feature-item">
              🌐 Responsive design for a great experience on any device
            </li>
            <li class="feature-item">
              🔗 Easily share your notes with fellow users
            </li>
          </ul>

          <p class="additional-info">
            Developed with Vue.js, Firebase, and Vite, the app also leverages
            GitHub Actions for continuous integration and deployment to Firebase
            Hosting, ensuring smooth updates. As this is the beta testing phase,
            I'd love to hear your feedback on the app's functionality and any
            areas for improvement.
          </p>

          <p class="contact-info">
            Created by Niman Ahmed. Contact me at
            <a href="mailto:notesyncservice@gmail.com" class="contact-email"
              >notesyncservice@gmail.com</a
            >
            with any questions or feedback!
          </p>
        </div>

        <!-- Right Section -->
        <div class="right-section">
          <!-- Sign Up Section -->
          <div class="signup-section" v-if="!signedIn">
            <p class="signup-prompt">
              Get started and start capturing your thoughts, ideas, and
              inspirations!
            </p>
            <router-link to="/register" class="signup-link">
              Sign up Now!
            </router-link>
          </div>

          <!-- Signed In Section -->
          <div class="signedin-section" v-if="signedIn">
            <p class="signup-prompt">
              Stay tuned! I will be adding more features like a reminder and
              sharing with friends.
            </p>
            <router-link to="/new-note" class="write-link">
              Start Writing!
            </router-link>
          </div>
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
// import "../assets/components_CSS/home.css";

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

<style scoped>
/* CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Body */
body {
  font-family: "Roboto", sans-serif;
  background: #2c3e50;
  color: #ecf0f1;
}

/* Content Container */
.content-container {
  width: 80%;
  max-width: 1200px;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 20px;
}

.main-title {
  font-size: 2.5em;
  margin-bottom: 10px;
  font-weight: bold;
}

.main-description {
  font-size: 1.2em;
  margin-bottom: 20px;
  line-height: 1.5;
}

.section-title {
  font-size: 1.5em;
  margin-bottom: 10px;
  font-weight: bold;
}

.section-description,
.additional-info,
.contact-info {
  margin-bottom: 20px;
  line-height: 1.5;
}

/* Features List */
.features-list {
  list-style: none;
  padding-left: 20px;
  margin-bottom: 20px;
}

.feature-item {
  margin-bottom: 10px;
}

/* Contact Email */
.contact-email {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.contact-email:hover {
  color: #3498db;
}

/* Sign Up and Signed In Sections */
.signup-section,
.signedin-section {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.signup-section:hover,
.signedin-section:hover {
  background-color: #e9e9e9;
}

.signup-prompt {
  margin-bottom: 20px;
}

.signup-link,
.write-link {
  text-decoration: none;
  padding: 10px 20px;
  display: inline-block;
  transition: background-color 0.3s;
  border-radius: 5px;
  border: 1px solid #333;
  color: #fff;
  background-color: #333;
}

.signup-link:hover,
.write-link:hover {
  background-color: #fff;
  color: #333;
}

/* Main Content */
.main-content {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 5rem;
}

/* Media Queries */
@media screen and (max-width: 700px) {
  .main-content {
    display: flex;
    margin-top: 20px;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
  }

  .main-container {
    display: flex;
    justify-content: center;
    margin-top: 5rem;
  }

  .left-section,
  .right-section {
    border: 1px solid #333;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px #0000001a;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  .logo-image {
    max-width: 100px;
    margin-bottom: 10px;
    margin: 0 auto;
  }
}

@media screen and (min-width: 700px) {
  .left-section,
  .right-section {
    border: 1px solid #333;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px #0000001a;
    padding: 1rem;
    width: calc(50% - 20px);
  }

  .logo-image {
    max-width: 100px;
    margin-bottom: 10px;
    margin: 0 auto;
    margin-top: 5rem;
  }
}

/* Main Container */
.main-container {
  display: flex;
  justify-content: center;
  margin-top: 5rem;
}
</style>

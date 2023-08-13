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
          <p class="section-description">
            Note-taking web app, designed for seamless and secure organization
            of your personal notes!
          </p>
          <ul class="features-list">
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

          <div class="signedin-section second" v-if="signedIn">
            <p class="game-invite">
              Can you guess the flag by the country name?
              <router-link to="/FlagGame" class="game-link">
                Play Now!
              </router-link>
            </p>
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
.game-invite {
  font-size: 16px;
  margin: 10px 0;
  color: #555;
}

.game-link {
  color: #0099cc;
  text-decoration: none;
  margin-left: 5px;
  padding: 5px 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-block;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.game-link:hover {
  background-color: #e9e9e9;
}

.write-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.write-link:hover {
  background-color: #45a047;
}

.main-container {
  font-family: "Arial", sans-serif;
  background-color: #f7f9fc;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.content-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
  padding-top: 5rem;
}

.header-section {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e6e8eb;
}

.logo-image {
  width: 100px;
  height: auto;
  margin: 0 auto;
}

.main-title {
  color: #333;
  margin-top: 20px;
  margin-bottom: 10px;
}

.main-description {
  color: #777;
}

.main-content {
  display: flex;
  justify-content: space-between;
  padding: 30px 0;
}

.left-section {
  flex: 1;
  margin-right: 40px;
}

.right-section {
  flex: 1;
}

.section-description,
.additional-info {
  color: #555;
  margin-bottom: 20px;
}

.features-list {
  padding-left: 20px;
  margin-bottom: 20px;
}

.feature-item {
  margin-bottom: 10px;
}

li.feature-item:hover {
  color: #3498db;
  cursor: pointer;
}

.contact-info {
  margin-top: 30px;
}

.contact-email {
  color: #0077cc;
  text-decoration: none;
  transition: color 0.3s;
}

.contact-email:hover {
  color: #0055aa;
}

.signup-section,
.signedin-section {
  background-color: #f0f2f5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.signup-prompt {
  color: #555;
}

.signup-link,
.write-link {
  display: inline-block;
  background-color: #0077cc;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.signup-link:hover,
.write-link:hover {
  background-color: #0055aa;
}

.signedin-section.second {
  margin-top: 20px;
}

/* responsive */
@media (max-width: 768px) {
  .content-container {
    padding: 20px;
    margin-top: 1rem;
  }

  .main-content {
    flex-direction: column;
  }

  .left-section,
  .right-section {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .right-section {
    order: -1;
  }

  .logo-image {
    width: 80px;
  }

  .main-title {
    font-size: 24px;
  }

  .signup-link,
  .write-link {
    padding: 8px 16px;
  }
}
</style>

<template>
  <div class="container">
    <header>
      <img
        src="../assets/notebooknd-shop.jpeg"
        alt="NoteSync"
        style="max-width: 200px"
      />
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
          <li>🚀 Key features: </li>
          <li>✍️ Create, read, update, and delete notes with ease</li>
          <li>
            🔄 Real-time data synchronization with Firebase Realtime Database
          </li>
          <li>🔒 Secure user sign-up and sign-in using Google OAuth</li>
          <li>🌐 Responsive design for a great experience on any device</li>
          <li>🔗 Easily share your notes with fellow users</li>
        </ul>
        <p>
          Developed with Vue.js, Firebase, and Vite, the
          app also leverages GitHub Actions for continuous integration and
          deployment to Firebase Hosting, ensuring smooth updates. As this is
          the beta testing phase, I'd love to hear your feedback on the app's
          functionality and any areas for improvement.
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
/* General CSS reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #000000;
  color: #333;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

    display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

/*   
  margin-bottom: 3rem;
  background-color: #fff;
  color: #1c1b1b;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.1); */
}

header {
  /* display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 3rem;
  background-color: #fff;
  color: #1c1b1b; */

  padding: 2rem;
  border-radius: 1rem;

  /* box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.1); */
}

header img {
  max-width: 200px;
  margin-bottom: 1rem;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

header p {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.content {
  gap: 2rem;
  flex-direction: column;

}

.left,
.right {
  flex: 1;
}

.left {
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.1);


  
}

.left h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.left p {
  margin-bottom: 1rem;
}

.left ul {
  list-style-type: none;
  padding-left: 1.5rem;
}

.left li {
  margin-bottom: 0.5rem;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  
}

.right p {
  margin-bottom: 1rem;
}

.left,
.right {
  flex: none;
  max-width: 100%;
}

router-link {
  display: inline-block;
  background-color: #3f51b5;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
}

router-link:hover {
  background-color: #5c6bc0;
  cursor: pointer;
}
.email {
  color: #4caf50;
  text-decoration: none;
  font-weight: bold;
}

.sign-up {
  margin: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  color: #fff;
  font-weight: 500;
  text-decoration: none;
}

.sign-up:hover {
  background-color: #388e3c;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.signed-in {
  /* display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 3rem;
  background-color: #fff;
  color: #1c1b1b;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.1); */

    display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
}

.signed-in p {
  font-size: 1rem;
  margin-bottom: 1rem;
}
</style>

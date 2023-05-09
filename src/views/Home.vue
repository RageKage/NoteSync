<template>
  <div class="main-container">
    <div class="logo-container">
      <img
        src="../assets/notebooknd-shop.jpeg"
        alt="NoteSync"
        style="max-width: 200px"
      />
    </div>
    <h1 class="header-title">Welcome to NoteSync!</h1>
    <p class="header-tagline">
      A place to Capture your thoughts and ideas in one place that is easily
      accessible.
    </p>
    <div class="cta-container">
      <p>
        Get started and start capturing your thoughts, ideas, and inspirations!
      </p>
      <router-link v-if="!signedIn" class="cta-button" to="/register">
        Sign up Now!
      </router-link>
      <router-link v-if="signedIn" to="/new-note" class="cta-button">
        Start Writing!
      </router-link>
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

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0;
}

a {
  color: #333;
  text-decoration: none;
}

a:hover {
  color: #555;
}

/* Main container */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Logo container */
.logo-container {
  text-align: center;
  margin-bottom: 20px;
}

/* Header */
.header-title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 10px;
}

.header-tagline {
  font-size: 18px;
  text-align: center;
  margin-bottom: 40px;
}

/* Features */
.features-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
}

.feature-easy,
.feature-organized,
.feature-secure {
  display: flex;
  align-items: center;
  width: 30%;
}

.feature-easy div,
.feature-organized div,
.feature-secure div {
  margin-left: 10px;
}

/* Call to action */
.cta-container {
  text-align: center;
  margin-bottom: 20px;
}

.cta-button {
  display: inline-block;
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.cta-button:hover {
  background-color: #5a5a5a;
  color: #fff;
}
</style>

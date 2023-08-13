<template>
  <div class="not-found">
    <h1 class="error-code">404</h1>
    <h2 class="error-message">Page Not Found</h2>
    <p class="suggestion">Sorry, the page you are looking for does not exist.</p>
    <router-link to="/" class="back-link"   @click="redirectToHome">Go Back Home</router-link>
  </div>
</template>


<script setup>
import { useRoute, useRouter } from "vue-router";

import "../assets/test.css";

const router = useRouter();

const redirectToHome = () => {
  router.push("/");
};
</script>
<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f3f3;
}

.error-code {
  font-size: 6em;
  color: #d63031;
}

.error-message {
  font-size: 2em;
  color: #2d3436;
  margin-bottom: 20px;
}

.suggestion {
  font-size: 1.2em;
  color: #636e72;
  margin-bottom: 30px;
}

.back-link {
    font-size: 1.25rem;
    color: #3B82F6;
    text-decoration: none;
    padding: 10px 20px;
    border: 1px solid #3B82F6;
    border-radius: 5px;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.back-link:hover {
    background-color: #3B82F6;
    color: #ffffff;
}
</style>

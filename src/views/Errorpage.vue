<template>
  <div class="page-not-found">
    <h1>Page not Found</h1>
    <h1>ERROR - 404</h1>
    <button @click="redirectToHome">Go Home</button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();

const redirectToHome = () => {
    router.push('/');
}
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.page-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  font: 1em sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1em;
  text-transform: uppercase;
  cursor: pointer;
  background-color: #3498db;
  border: none;
  color: white;
  border-radius: 4px;
}

button:hover {
  background-color: #2980b9;
}
</style>

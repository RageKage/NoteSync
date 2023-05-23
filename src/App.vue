<template>
<div >
  <Header></Header>
    <router-view></router-view>
  <!-- <Footer></Footer> -->

</div>




</template>
<script setup>
import { onMounted, ref } from 'vue';
import { getAuth, signOut as signOutFirebase } from 'firebase/auth';
import router from './router/router';
import Header from './components/Header.vue'
</script>

<style>

</style>
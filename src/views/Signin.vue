<template>
  <div class="container">
    <form class="form">
      <h1 class="form-title">Sign-in</h1>
      <div class="form-input-container">
        <label for="email">Email</label>
        <input id="email" type="email" placeholder="Email" v-model="email" />
      </div>
      <div class="form-input-container">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          v-model="password"
        />
      </div>
      <p v-if="errMsg" class="error-message">{{ errMsg }}</p>
    </form>
    <div class="form-submit-container">
      <button class="form-submit-button" @click="handleSignIn">Submit</button>
      <button class="form-google-button" @click="signInWithGoogle">
        Sign in with Google
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import router from "../router/router";
import { useAuthUserStore } from "../stores/authUser.js";

// pinia store instance for authentication
const authUserStore = useAuthUserStore();
const email = ref("");
const password = ref("");
const errMsg = ref("");

const handleSignIn = async () => {
  const response = await authUserStore.registerOrSignIn(
    email.value,
    password.value,
    true
  );

  if (response.success) {
    console.log("Successfully Sign-in!");
    router.push("/new-note");
  } else {
    console.log(response.error);
    alert(response.error.message);
    switch (
      response.error.code // a switch to handle different type of error when signing in has failed
    ) {
      case "auth/invalid-email": // if the api returns invalid-email then show that to the user
        errMsg.value = "Invalid email";
        break;
      case "auth/user-not-found":
        errMsg.value = "User not found";
        break;
      case "auth/wrong-password":
        errMsg.value = "Wrong password";
        break;
      default:
        errMsg.value = "Email or password is incorrect";
        break;
    }
  }
};

const signInWithGoogle = async () => {
  const response = await authUserStore.signInWithGoogle();
  if (response.success) {
    console.log("Successfully registered!");
    router.push("/my-notes");
  } else {
    console.log(response.error);
    alert(response.error.message);
  }
};
</script>

<style scoped>
/* registration container  */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 50%;
  height: 100%;
}
/* registration form for smaller screens */
@media screen and (max-width: 568px) {
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 80%;
    height: 100%;
  }
}

/* registration form  */
.form-title {
  margin-top: 0;
}
.form-input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
label {
  font-weight: 700;
  margin-bottom: 0.5rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 2px solid #ccc;
}
.form-submit-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-submit-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.form-submit-button:hover {
  background-color: #388e3c;
}

/* Google sign-in */
.form-google-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #fff;
  color: #757575;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.form-google-button:hover {
  border: 1px solid #757575;
  color: #212121;
}
</style>

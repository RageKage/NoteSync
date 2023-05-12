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
    <div class="form-submit-container" >
      <button class="form-submit-button" @click="handleSignIn">Submit</button>
      <button class="form-google-button" @click="signInWithGoogle" v-if="notshow.value">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Google Logo"
          class="google-logo"
        />
        Sign in with Google
      </button>
      <div class="forgot-password" v-if="notshow.value">
        <router-link class="forgot-password-btn" to="/resetPassword"> Forgot Password</router-link>
      </div>
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
const notshow = false

const handleSignIn = async () => {
  const response = await authUserStore.registerOrSignIn(
    email.value,
    password.value,
    null,
    true
  );

  if (response.success) {
    console.log("Successfully Sign-in!");
    router.push("/new-note");
  } else {
    // console.log(response.error);

    // alert(response.error.message);
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
    // console.log(response.error);
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
  padding: 8px 24px;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.form-submit-button:hover {
  background-color: #388e3c;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* Google sign-in */
.form-google-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #102d5e;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 24px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  transition: background-color 0.3s, box-shadow 0.3s;
}
.form-google-button:hover {
  background-color: #2a75f3;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.google-logo {
  height: 20px;
  width: 20px;
  margin-right: 8px;
}

/* Password reset */
.forgot-password {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.forgot-password-btn {
  background-color: #1e88e5;
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-transform: uppercase;
  transition: background-color 0.3s ease;
  text-decoration: none;
}

.forgot-password-btn:hover {
  background-color: #1565c0;
}
</style>

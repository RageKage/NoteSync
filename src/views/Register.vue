<template>
  <div class="container">
    <form class="form">
      <h1 class="form-title">Get Started</h1>
      <div class="form-input-container">
        <label for="user-name">Name</label>
        <input
          id="user-name"
          type="text"
          placeholder="Name"
          v-model="userName"
        />
      </div>
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
    </form>

    <div class="form-submit-container">
      <button class="form-submit-button" @click="handleRegister">Submit</button>
      <button class="form-google-button" @click="signInWithGoogle">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Google Logo"
          class="google-logo"
        />
        Sign in with Google
      </button>
      <button class="form-guest-button" @click="signInAsGuest">
        Continue as Guest
      </button>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Guest Account Details</h2>
        <p><strong>Username:</strong> {{ guestCredentials.email }}</p>
        <p><strong>Password:</strong> {{ guestCredentials.password }}</p>
        <p>Save these credentials to log back into your guest account.</p>
        <button class="modal-actions" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import router from "../router/router";
import { useAuthUserStore } from "../stores/authUser.js";

const authUserStore = useAuthUserStore();
const email = ref("");
const password = ref("");
const userName = ref("");

const showModal = ref(false);
const guestCredentials = ref(null);

const closeModal = () => {
  showModal.value = false;
  router.push("/new-note");
};

const handleRegister = async () => {
  // register with email
  console.log("Register");
  const response = await authUserStore.registerOrSignIn(
    email.value,
    password.value,
    userName.value
  );
  if (response.success) {
    console.log("Successfully registered!");
    router.push("/new-note"); // take them to the new note page when they login in
  } else {
    // console.log(response.error);
    // alert(response.error.message);
  }
};

const signInWithGoogle = async () => {
  // sign in with Google
  const response = await authUserStore.signInWithGoogle();
  if (response.success) {
    console.log("Successfully registered!");
    router.push("/new-note");
  }
};

const signInAsGuest = async () => {
  guestCredentials.value = await authUserStore.signInAsGuest();
  console.log(guestCredentials);
  showModal.value = true;
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

/* Guest sign-in */

.form-guest-button {
  margin-top: 1rem;
  padding: 8px 24px;
  background-color: #009688;
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
.form-guest-button:hover {
  background-color: #00796b;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* modal  */

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}
.modal h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.modal-actions {
  background-color: #f1f1f1;
  color: #666;

  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  color: #fff;
  background-color: #07c;
  border: none;
  cursor: pointer;
}
.modal-actions:hover {
  background-color: #e1e1e1;
}
</style>

<template>
  <div class="container">
    <form class="form">
      <h1 class="form-title">Create an Account</h1>
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
    password.value
  );
  if (response.success) {
    console.log("Successfully registered!");
    router.push("/new-note"); // take them to the new note page when they login in
  } else {
    console.log(response.error);
    alert(response.error.message);
  }
};

const signInWithGoogle = async () => {
  // sign in with Google
  const response = await authUserStore.signInWithGoogle();
  if (response.success) {
    console.log("Successfully registered!");
    router.push("/new-note");
  } else {
    console.log(response.error);
    alert(response.error.message);
  }
};

const signInAsGuest = async () => {

  guestCredentials.value = await authUserStore.signInAsGuest();
  console.log(guestCredentials)
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

/* Guest sign-in */

.form-guest-button {
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
.form-guest-button:hover {
  border: 1px solid #757575;
  background-color: #757575;
  color: #fff;
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

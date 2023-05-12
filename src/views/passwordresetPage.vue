<template>
  <div class="reset-container">
    <h2>Password Reset</h2>
    <form @submit.prevent="resetPassword">
      <div class="input-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="button-group">
        <button type="submit" class="reset-button" @click="passwordreset()">
          Reset Password
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {
  getAuth,
  onAuthStateChanged,
  signOut as signOutFirebase,
} from "firebase/auth";
import { ref } from "vue";
import { useAuthUserStore } from "../stores/authUser.js";
import router from "../router/router";
import Swal from "sweetalert2";

const authUserStore = useAuthUserStore();
const auth = getAuth();

const email = ref(null);

const passwordreset = async () => {
  const result = await authUserStore.resetPassword(email.value);
  if (result.success) {
    router.push("/sign-in");
    return Swal.fire({
      text: `Password reset email sent!`,
      icon: "success",
    });
  } else {
    return Swal.fire({
      text: `Error: ${result.error.message}`,
      icon: "error",
    });
  }
};
</script>

<style scoped>
.reset-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;

  background-color: #f8f9fa;

  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 30px;
}

.input-group,
.button-group {
  width: 100%;
  margin-bottom: 20px;
}

label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
  display: flex;
}

input {
  display: block;
  width: 100%;
  padding: 8px;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.reset-button {
  display: inline-block;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  text-align: center;
  white-space: nowrap;
}

.reset-button:hover {
  background-color: #0056b3;
}
</style>

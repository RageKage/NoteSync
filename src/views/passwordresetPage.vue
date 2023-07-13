<template>
  <div class="reset-container bg-white flex flex-col items-center justify-center">
    <h1 class="text-black">Reset Password</h1>
    <form class="w-full max-w-sm" @submit.prevent="resetPassword">
      <div class="flex items-center border-b border-black py-2">
        <input
          class="appearance-none bg-transparent border-none w-full text-black mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="...@example.com"
          aria-label="Full email"
          v-model="email"
          required
        />
        <button
          class="flex-shrink-0 bg-black hover:bg-gray-700 border-black hover:border-gray-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="button"
          @click="passwordreset()"
        >
          Reset Password
        </button>
        <button
          class="flex-shrink-0 border-transparent border-4 text-black hover:text-gray-700 text-sm py-1 px-2 rounded"
          type="button"
          @click="goback()"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>




<script setup>
// Imports
import { getAuth } from "firebase/auth";
import { ref } from "vue";
import { useAuthUserStore } from "../stores/authUser.js";
import router from "../router/router";
import Swal from "sweetalert2";
import '@/assets/dark.scss'
import "../assets/test.css";

// Pinia store instance for auth user
const authUserStore = useAuthUserStore();

// Firebase auth instance
const auth = getAuth();

// Refs
const email = ref(null);
const errMsg = ref("");

// Functions
const showAlert = (message, icon) => {
  return Swal.fire({
    text: message,
    icon: icon,
  });
};

const passwordreset = async () => {
  const result = await authUserStore.resetPassword(email.value);
  if (result.success) {
    router.push("/sign-in");
    return showAlert(`Password reset email sent!`, "success");
  } else {
    switch (
      result.error.code // handle different types of error when signing in has failed
    ) {
      case "auth/invalid-email":
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
    return showAlert(`Error: ${errMsg.value}`, "error");
  }
};

const goback = () => {
  if (auth.currentUser) {
    router.push("/profile");
  } else {
    router.push("/sign-in");
  }
};
</script>

<style scoped>
/* Reset Container styles */
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

/* Heading styles */
h2 {
  margin-bottom: 30px;
}

/* Input Group and Button Group styles */
.input-group,
.button-group {
  width: 100%;
  margin-bottom: 20px;
}

/* Label styles */
label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
  display: flex;
}

/* Input styles */
input {
  display: block;
  width: 100%;
  padding: 8px;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

/* Reset Button styles */
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

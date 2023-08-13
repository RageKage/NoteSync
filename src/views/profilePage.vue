<template>
  <div class="container">
    <div class="profile" v-if="auth">
      <div class="header">
        <img :src="displayedImage" alt="User photo" class="profile-photo" />
        <div class="user-info">
          <h1 class="user-name">{{ userName }}</h1>
          <p class="welcome-message">{{ welcomeMessage }}</p>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Contact Information</h2>
        <div class="contact-info">
          <label for="user-email" class="label">Email:</label>
          <p id="user-email" class="value">{{ userEmail }}</p>
          <div v-if="!isGuest" class="password-reset">
            <label for="password-reset" class="label">Password reset?</label>
            <p class="password-action">
              <button
                id="password-reset"
                @click="passwordreset(userEmail)"
                class="password-reset-btn"
              >
                Reset
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
// Imports
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onBeforeUnmount, computed, onMounted } from "vue";
import { useAuthUserStore } from "../stores/authUser.js";
import Swal from "sweetalert2";
import '@/assets/dark.scss'
// import "../assets/components_CSS//profile.css";

// Pinia store instance for auth user
const authUserStore = useAuthUserStore();

// Firebase auth instance
const auth = getAuth();

// Refs
const email = ref(null);
const userPic = ref(null);
const userEmail = ref(null);
const userName = ref(null);
const isGuest = ref(null);

// Functions
const showAlert = (message, icon) => {
  return Swal.fire({
    text: message,
    icon: icon,
  });
};

const passwordreset = async (userEmail) => {
  const result = await authUserStore.resetPassword(userEmail);
  if (result.success) {
    return showAlert(`Password reset email sent!`, "success");
  } else {
    return showAlert(`Error: ${result.error.message}`, "error");
  }
};

const resetUserValues = () => {
  userPic.value = null;
  userEmail.value = null;
  userName.value = null;
  isGuest.value = null;
};

// Computed values
const welcomeMessage = computed(() => {
  return userEmail.value && userEmail.value.endsWith("@notesync.com")
    ? "Welcome back, Guest"
    : "Welcome back";
});

const displayedImage = computed(() => {
  return userEmail.value && userEmail.value.endsWith("@notesync.com")
    ? "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.jpg"
    : userPic.value;
});

// Event listeners
onMounted(() => {
  // console.log(auth.currentUser.displayName)
});

onAuthStateChanged(auth, (user) => {
  if (user || userEmail) {
    userPic.value = user.photoURL;
    userEmail.value = user.email;
    userName.value = user.displayName;
    isGuest.value = auth.currentUser.email.endsWith("@notesync.com");
    console.log(user.photoURL);
    console.log(user.email);
    console.log(user.displayName);
  } else {
    resetUserValues();
  }
});

onBeforeUnmount(() => {
  console.log(userName.value);
  resetUserValues();
});
</script>
<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  .profile {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 6rem;
    background-color: #f0f2f5;
    padding: 20px;
    border-radius: 8px;


    
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }

  .profile-photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;

  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-size: 24px;
    margin: 0;
  }

  .welcome-message {
    font-size: 18px;
    color: #666;
    margin: 0;
  }

  .section {
    margin-bottom: 30px;
  }

  .section-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
  }

  .label {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }

  .value {
    font-size: 16px;
    color: #666;
    margin: 0;
  }

  .password-reset {
    margin-top: 10px;
  }

  .password-reset-btn {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }

  .password-reset-btn:hover {
    background-color: #0056b3;
  }
</style>

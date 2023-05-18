<template>
  <div class="container">
    <div class="profile" v-if="auth">
      <div class="log">
        <img :src="displayedImage" alt="User photo" />
        <div class="user">
          {{ welcomeMessage }}
          <p>{{ userName }}</p>
        </div>
        <div class="user-info">
          <div class="info-container">
            <div class="email">
              <label for="user-email" class="email-label">Email:</label>
              <p id="user-email" class="email-value">
                {{ userEmail }}
              </p>
            </div>
            <div class="password" v-if="!isGuest">
              <label for="password-reset" class="password-label"
                >Password reset?</label
              >
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
  </div>
</template>

<script setup>
// Imports
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onBeforeUnmount, computed, onMounted } from "vue";
import { useAuthUserStore } from "../stores/authUser.js";
import Swal from "sweetalert2";
import "../assets/components_CSS//profile.css";


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



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

<style scoped>
/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* Profile */
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-top: 6rem;
}

@media screen and (max-width: 700px) {
  .profile {
    margin-top: 0.5rem;
  }
}

/* img */
.log {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.log img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

/* User-info */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
}

.user {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
}

.email-label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.email-value {
  margin: 0;
}

.password {
  font-size: 1rem;
  font-weight: normal;
  color: #000000;

  display: block;
  font-weight: bold;
  margin-bottom: 5px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin-top: 1rem;
}

.password p {
  font-size: 1rem;
  font-weight: 400;
  color: #34495e;
}

.password button {
  border: none;
  color: #ffffff;
  font-size: 0.6rem;
  margin-left: 0.5rem;
  padding: 0.2rem 0.9rem;
  text-transform: uppercase;
  transition: background-color 0.3s ease;
  background-color: #f44336;
  text-decoration: none;
  cursor: pointer;
  border-radius: 4px;
}

.password button:hover {
  background-color: #da190b;
}
</style>

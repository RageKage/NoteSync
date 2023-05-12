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
            <div class="password">
              <label for="password-reset" class="password-label"
                >Password reset:</label
              >
              <p class="password-action">
                <button
                  id="password-reset"
                  @click="passwordreset(userEmail)"
                  v-if="!isGuest"
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
import {
  getAuth,
  onAuthStateChanged,
  signOut as signOutFirebase,
} from "firebase/auth";
import { ref, onBeforeUnmount, computed, onMounted } from "vue";
import { useAuthUserStore } from "../stores/authUser.js";

const authUserStore = useAuthUserStore();

const email = ref(null);

const auth = getAuth();

const userPic = ref(null);
const userEmail = ref(null);
const userName = ref(null);
const isGuest = ref(null);

onMounted(() => {
  // console.log(auth.currentUser.displayName)
});

onAuthStateChanged(auth, (user) => {
  // check if user there is a user
  if (user || userEmail) {
    // set the values until they leave
    userPic.value = user.photoURL;
    userEmail.value = user.email;
    userName.value = user.displayName;
    isGuest.value = auth.currentUser.email.endsWith("@notesync.com");
    console.log(user.photoURL);
    console.log(user.email);
    console.log(user.displayName);
  } else {
    userPic.value = null;
    userEmail.value = null;
    userName.value = null;
    isGuest.value = null;
  }
});

onBeforeUnmount(() => {
  // set the values to null after they leave
  console.log(userName.value);
  userPic.value = null;
  userEmail.value = null;
  userName.value = null;
  isGuest.value = null;
});

const welcomeMessage = computed(() => {
  return userEmail.value && userEmail.value.endsWith("@notesync.com") // check if the user is a guest and if yes then show the message they are a guest
    ? "Welcome back, Guest"
    : "Welcome back";
});

const displayedImage = computed(() => {
  if (userEmail.value && userEmail.value.endsWith("@notesync.com")) {
    return "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.jpg";
  } else {
    return userPic.value;
  }
});

const passwordreset = async (userEmail) => {
  const result = await authUserStore.resetPassword(userEmail);
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Arial", sans-serif;
  font-size: 14px;
  line-height: 1.5;
  background-color: #f5f5f5;
}

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
  margin-top: 2rem;
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

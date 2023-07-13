<template>
  <!-- Outermost container -->
  <div class="main-container">
    <!-- Signup form container -->
    <div v-if="showSignup" class="signup-container">
      <form class="signup-form">
        <h1 class="form-title">Sign-up</h1>

        <!-- Email input field -->
        <div class="email-input-container">
          <label for="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            placeholder="Email"
            v-model="signupEmail"
            class="email-input"
          />
        </div>

        <!-- Password input field -->
        <div class="password-input-container">
          <label for="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            placeholder="Password"
            v-model="signupPassword"
            class="password-input"
          />
        </div>

        <!-- Error message display -->
        <p v-if="signupErrMsg" class="error-message">{{ signupErrMsg }}</p>
      </form>

      <!-- Signup buttons container -->
      <div class="signup-buttons-container">
        <!-- Registration button -->
        <button class="signup-button" @click="handleRegister">Sign Up</button>

        <!-- Google sign in button -->
        <button class="google-signin-button" @click="signInWithGoogle">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google Logo"
            class="google-logo"
          />
          Sign in with Google
        </button>

        <!-- Guest sign in button -->
        <button class="guest-signin-button" @click="signInAsGuest">
          Continue as Guest
        </button>
      </div>

      <!-- Modal container -->
      <div v-if="showModal" class="modal-container">
        <!-- Modal content container -->
        <div class="modal-content">
          <h2>Guest Account Details</h2>
          <p><strong>Username:</strong> {{ guestCredentials.email }}</p>
          <p><strong>Password:</strong> {{ guestCredentials.password }}</p>
          <p>Save these credentials to log back into your guest account.</p>

          <!-- Modal close button -->
          <button class="modal-close-button" @click="closeModal">Close</button>
        </div>
      </div>
    </div>

    <!-- Sign in form container -->
    <div v-else class="signin-container">
      <form class="signin-form">
        <h1 class="form-title">Sign-in</h1>

        <!-- Email input field -->
        <div class="email-input-container">
          <label for="signin-email">Email</label>
          <input
            id="signin-email"
            type="email"
            placeholder="Email"
            v-model="signinEmail"
            class="email-input"
          />
        </div>

        <!-- Password input field -->
        <div class="password-input-container">
          <label for="signin-password">Password</label>
          <input
            id="signin-password"
            type="password"
            placeholder="Password"
            v-model="signinPassword"
            class="password-input"
          />
        </div>

        <!-- Error message display -->
        <p v-if="signinErrMsg" class="error-message">{{ signinErrMsg }}</p>
      </form>

      <!-- Signin buttons container -->
      <div class="signin-buttons-container">
        <!-- Sign in button -->
        <button class="signin-button" @click="handleSignIn">Sign In</button>

        <!-- Google sign in button -->
        <button class="google-signin-button" @click="signInWithGoogle">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google Logo"
            class="google-logo"
          />
          Sign in with Google
        </button>

        <!-- Forgot password link -->
        <div class="forgot-password-container">
          <router-link class="forgot-password-link" to="/resetPassword">
            Forgot Password
          </router-link>
        </div>
      </div>
    </div>

    <!-- Form toggle button container -->
    <div class="form-toggle-container">
      <!-- Button to toggle between Sign up and Sign in -->
      <button class="form-toggle-button" @click="toggleForm">
        {{
          showSignup
            ? "Already have an account? Sign in."
            : "Don't have an account? Sign up."
        }}
      </button>
    </div>
  </div>
</template>

<script setup>
// Imports
import { ref, onMounted } from "vue";
import router from "../router/router.js";
import { useAuthUserStore } from "../stores/authUser.js";
import Swal from "sweetalert2";
import '@/assets/dark.scss'


// Pinia store instance
const authUserStore = useAuthUserStore();

// Refs
const signupEmail = ref("");
const signupPassword = ref("");
const signinEmail = ref("");
const signinPassword = ref("");
const userName = ref("");
const signupErrMsg = ref("");
const signinErrMsg = ref("");
const showSignup = ref(true);
const showModal = ref(false);
const guestCredentials = ref(null);

// Functions
const showAlert = (icon, title, text) => {
  return Swal.fire({
    icon: icon,
    title: title,
    text: text,
  });
};

const closeModal = () => {
  showModal.value = false;
  router.push("/new-note");
};

const handleSignIn = async () => {
  const response = await authUserStore.registerOrSignIn(
    signinEmail.value,
    signinPassword.value,
    null,
    true
  );
  if (response.success) {
    console.log("Successfully Sign-in!");
    router.push("/new-note");
  } else {
    switch (response.error.code) {
      case "auth/invalid-email":
        signinErrMsg.value = "Invalid email";
        break;
      case "auth/user-not-found":
        signinErrMsg.value = "User not found";
        break;
      case "auth/wrong-password":
        signinErrMsg.value = "Wrong password";
        break;
      default:
        signinErrMsg.value = "Email or password is incorrect";
        break;
    }
  }
};

const handleRegister = async () => {
  try {
    if (!signupEmail.value && !signupPassword.value) {
      return showAlert(
        "error",
        "Oops...",
        "Please fill in all required fields!"
      );
    }
    const response = await authUserStore.registerOrSignIn(
      signupEmail.value,
      signupPassword.value,
      userName.value
    );
    console.log(response);
    if (response.success) {
      console.log("Successfully registered!");
      router.push("/new-note");
    } else {
      if (
        response.error.code === "auth/email-already-in-use" ||
        response.error.code === "auth/invalid-email"
      ) {
        signupEmail.value = "";
        return showAlert(
          "info",
          "Oops...",
          "The email you provided is already in use or isn't valid. Please try again"
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const signInWithGoogle = async () => {
  const response = await authUserStore.signInWithGoogle();
  if (response.success) {
    router.push("/my-notes");
  } else {
    alert(response.error.message);
  }
};

const signInAsGuest = async () => {
  guestCredentials.value = await authUserStore.signInAsGuest();
  console.log(guestCredentials);
  showModal.value = true;
};

const toggleForm = () => {
  showSignup.value = !showSignup.value;
};

// Event Listeners
onMounted(() => {
  const alertKey = "ShowAlert";
  const alert = localStorage.getItem(alertKey);
  if (!alert) {
    showAlert(
      "info",
      "Attention!",
      "Please continue as a Guest, as the 'Login with Google' feature is currently disabled while we work on resolving system issues. We apologize for any inconvenience."
    );
    localStorage.setItem(alertKey, true);
  }
});
</script>

<style scoped>


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Global styles */
body {
  font-family: Arial, sans-serif;
  background-color: white;
  color: black;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.error-message {
  color: red;
}

/* Signup form */
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signup-form,
.signin-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 50px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  margin-top: 5rem;
}

.signup-buttons-container,
.signin-buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signup-button,
.google-signin-button,
.guest-signin-button,
.signin-button,
.modal-close-button,
.form-toggle-button {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.signup-button, .guest-signin-button {
  background-color: black;
  color: white;
  border: 1px solid black;
}

.signup-button:hover,
.guest-signin-button:hover {
  background-color: white;
  color: black;
  transition: color 0.3s;
}

/* Signin form */
.signin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signin-button,
.google-signin-button {
  background-color: white;
  border: 1px solid black;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signin-button:hover {
  color: white;
  background-color: black;
  transition: color 0.3s;
}

.forgot-password-container {
  text-align: center;
}

.forgot-password-link {
  color: black;
  text-decoration: underline;
}

/* Form elements */
.form-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.email-input-container,
.password-input-container {
  width: 100%;
  margin-bottom: 10px;
}

.email-input,
.password-input {
  width: 100%;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
}

.google-logo {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

/* Modal */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

.modal-close-button {
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
}

/* Form toggle button */
.form-toggle-container {
  text-align: center;
  margin-top: 20px;
}

.form-toggle-button {
  background-color: transparent;
  border: none;
  color: black;
  text-decoration: underline;
  cursor: pointer;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .signup-form,
  .signin-form {
    width: 90%;
  }

  .email-input,
  .password-input {
    width: 100%;
  }
}

</style>


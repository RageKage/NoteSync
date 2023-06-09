<template>
  <div>
    <div class="nav-container" :style="{ top: navBarTop }">
      <section
        class="top-nav"
        v-if="showHeader && showHeader2"
        :style="{ fontSize: fontSize }"
      >
        <div
          class="logo"
          v-if="showUser && windowWidth > 701"
          @click="router.push('/')"
        >
          <div>
            <img
              src="../assets/pngfind.com-indiana-outline-png-2131193.png"
              alt="NoteSync"
              class="photo-icon"
            />
          </div>
          <div>
            <span
              class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
              >NoteSync</span
            >
          </div>
        </div>
        <!--  -->
        <input id="menu-toggle" type="checkbox" v-model="menuOpen" />
        <label class="menu-button-container" for="menu-toggle">
          <div class="menu-button"></div>
        </label>

        <ul class="menu">
          <li @click="closeMenu" class="menu-link">
            <router-link to="/">Home</router-link>
          </li>
          <li v-if="signedIn" @click="closeMenu" class="menu-link">
            <span class="separator" v-if="!dontShow"></span>
            <router-link to="/new-note">New Note</router-link>
          </li>
          <li v-if="signedIn" @click="closeMenu" class="menu-link">
            <span class="separator" v-if="!dontShow"></span>
            <router-link to="/my-notes">My Notes</router-link>
          </li>
          <li v-if="windowWidth <= 700" @click="closeMenu" class="menu-link">
            <span class="separator" v-if="!dontShow"></span>
            <router-link to="/profile" v-if="signedIn">Profile</router-link>
          </li>
          <li v-if="!signedIn" @click="closeMenu" class="menu-link">
            <span class="separator" v-if="!dontShow"></span>
            <router-link to="/register">Sign-In</router-link>
          </li>
          <li v-if="windowWidth <= 700" @click="closeMenu" class="menu-link">
            <span class="separator" v-if="!dontShow"></span>
            <a class="nav-signOut" @click="signOut" v-if="signedIn">Sign Out</a>
          </li>
        </ul>

        <div class="pop-up" v-if="signedIn && showHeader">
          <button
            v-if="!dontShow"
            type="button"
            class="show-men-button"
            @click="smallMenuOpen = !smallMenuOpen"
            id="user-menu-button"
          >
            <span class="sr-only">Open user menu</span>
            <img class="photo-icon-user" :src="displayedImage" alt="user photo" />
            <!--               class="w-12 h-13 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
 -->
          </button>

          <div v-if="smallMenuOpen" id="smallMenu" @click="!smallMenuClose">
            <div class="px-4 py-3">
              <span class="user-name">{{ welcomeMessage }}</span>
              <p>{{ userName }}</p>
              <span class="user-email">{{ userEmail }}</span>
            </div>
            <ul class="options">
              <li @click="smallMenuClose" v-if="signedIn">
                <a class="menu-link">
                  <router-link to="/profile">Profile</router-link>
                </a>
              </li>
              <li @click="smallMenuClose" v-if="signedIn">
                <a class="menu-link nav-signOut" @click="signOut">Sign Out</a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Imports
import { onMounted, ref, computed, onUnmounted, watch } from "vue";
import {
  getAuth,
  signOut as signOutFirebase,
  onAuthStateChanged,
} from "firebase/auth";
import router from "../router/router";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import '@/assets/dark.scss'
import { useAuthUserStore } from "../stores/authUser.js";
import "../assets/style.module.css"; // tailwind css
import "../assets/components_CSS/header.css"; // CSS for header

// Constants and refs
const authUserStore = useAuthUserStore();
const route = useRoute();
const auth = getAuth();
const signedIn = ref(false);
const menuOpen = ref(false);
const smallMenuOpen = ref(false);
const fontSize = ref("1em");
const email = ref(null);
const userPic = ref(null);
const userEmail = ref(null);
const userName = ref(null);
const isGuest = ref(null);
const dontShow = ref(false);
const showUser = ref(false);
const windowWidth = ref(0);

// Computed properties
const showHeader = computed(() => route.name !== "Error");

const showHeader2 = computed(() => route.name !== "resetPassword");

const welcomeMessage = computed(() =>
  userEmail.value && userEmail.value.endsWith("@notesync.com")
    ? "Welcome back, Guest"
    : "Welcome back"
);
const displayedImage = computed(() =>
  userEmail.value && userEmail.value.endsWith("@notesync.com")
    ? "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.jpg"
    : userPic.value
);

// Functions
const closeMenu = () => {
  menuOpen.value = false;
};
const smallMenuClose = () => {
  smallMenuOpen.value = false;
};

const signOut = async () => {
  try {
    await signOutFirebase(auth);
    router.push("/register");
  } catch (error) {
    console.error(error);
  }
};

const toggleShowBasedOnScreenWidth = () => {
  dontShow.value = window.innerWidth <= 700;
};

const toggleShowBasedOFFScreenWidth = () => {
  showUser.value = window.innerWidth > 700;
};

// Watchers
watch(windowWidth, () => {
  toggleShowBasedOnScreenWidth();
  toggleShowBasedOFFScreenWidth();
});

// hooks
onMounted(() => {
  windowWidth.value = window.innerWidth;
  toggleShowBasedOnScreenWidth();
  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      signedIn.value = true;
      userPic.value = user.photoURL;
      userEmail.value = user.email;
      userName.value = user.displayName;
      isGuest.value = auth.currentUser.email.endsWith("@notesync.com");
    } else {
      signedIn.value = false;
      userPic.value = null;
      userEmail.value = null;
      userName.value = null;
      isGuest.value = null;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });
});

let navBarTop = ref("0px"); // This will hold the top position of the navbar

let previousScrollPos = window.pageYOffset;

const handleScroll = () => {
  let currentScrollPos = window.pageYOffset;
  if (previousScrollPos > currentScrollPos) {
    navBarTop.value = "0px"; // Show the navbar
  } else {
    navBarTop.value = "-85px"; // Hide the navbar
  }
  previousScrollPos = currentScrollPos;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

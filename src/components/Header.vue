<template>
  <div>
    <section class="top-nav" v-if="showHeader" :style="{ fontSize: fontSize }">
      <div class="logo">
        <img
          src="../assets/notebooknd-shop.jpeg"
          alt="NoteSync"
          style="max-width: 200px"
        />
      </div>
      <input id="menu-toggle" type="checkbox" v-model="menuOpen" />
      <label class="menu-button-container" for="menu-toggle">
        <div class="menu-button"></div>
      </label>
      <ul class="menu">
        <li @click="closeMenu">
          <router-link to="/">Home</router-link>
        </li>
        <li v-if="signedIn" @click="closeMenu">
          <span class="separator">|</span>
          <router-link to="/new-note">New Note</router-link>
        </li>
        <li v-if="signedIn" @click="closeMenu">
          <span class="separator">|</span>
          <router-link to="/my-notes">My Notes</router-link>
        </li>
        <li v-if="!signedIn" @click="closeMenu">
          <span class="separator">|</span>
          <router-link to="/register">Register</router-link>
        </li>
        <li v-if="!signedIn" @click="closeMenu">
          <span class="separator">|</span>
          <router-link to="/sign-in">Sign In</router-link>
        </li>
        <li v-if="signedIn" @click="closeMenu">
          <span class="separator">|</span>
          <a class="nav-signOut" @click="signOut">Sign Out</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from "vue";
import { getAuth, signOut as signOutFirebase } from "firebase/auth";
import router from "../router/router";
import { useRoute } from "vue-router";

const route = useRoute();
const auth = getAuth();
const signedIn = ref(false);

const menuOpen = ref(false);

// this should close when the menu is clicked and one of the routes is clicked
const closeMenu = () => {
  menuOpen.value = false;
};

// Function to sign out the user
const signOut = async () => {
  try {
    await signOutFirebase(auth); // Sign out the user with Firebase Auth
    router.push("/sign-in"); // take them to the sign-in page
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      signedIn.value = true; // Set signedIn to true if the user is signed in
    } else {
      signedIn.value = false;
    }
  });
});

// hide the header when the error page shows up
const showHeader = computed(() => {
  return route.name !== "Error";
});

const fontSize = ref("1em");

// adjust the font size based on the display size
const calculateFontSize = () => {
  const width = window.innerWidth; // get the width of the window
  const height = window.innerHeight;
  const smallerDimension = Math.min(width, height);

  fontSize.value = `${Math.max(smallerDimension / 40, 10)}px`; // divide the smaller dimension by 40 and it can't be less then 10px
  // the higher the num that is divide by the smaller dimension the smaller the font size gets
};

onMounted(() => {
  window.addEventListener("resize", calculateFontSize);
  calculateFontSize();
});

onUnmounted(() => {
  window.removeEventListener("resize", calculateFontSize);
});

// const smallerDimension = () => {
//   const width = window.innerWidth;

//   if (width <= 500) {
//     return true;
//   } else {
//     return false;
//   }
// };
</script>

<style scoped>
* {
  font-family: "Raleway";
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  height: 100%;
}

.separator {
  display: inline;
}

/* Header nav */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  height: 60px;
  position: relative;
  z-index: 100;
}

.logo img {
  height: 50px;
}

.menu {
  display: flex;
  flex-direction: row;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.menu > li {
  overflow: hidden;
}

.menu li a {
  color: #000000;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.15em;
  display: inline-block;
  padding: 5px 5px;
  position: relative;
  padding-left: 1rem;
}

a:after {
  background: none repeat scroll 0 0 transparent;
  bottom: 0;
  content: "";
  display: block;
  height: 2px;
  left: 50%;
  position: absolute;
  background: #333;
  transition: width 0.3s ease 0s, left 0.3s ease 0s;
  width: 0;
}
a:hover:after {
  width: 100%;
  left: 0;
}

.nav-signOut:hover {
  color: #666;
  cursor: pointer;
}

/* Hamburger menu */
.menu-button-container {
  display: none;
  height: 100%;
  width: 30px;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#menu-toggle {
  display: none;
}

.menu-button,
.menu-button::before,
.menu-button::after {
  display: block;
  background-color: #000000;
  /* background-color: #fff; */

  position: absolute;
  height: 4px;
  width: 30px;
  transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
  border-radius: 2px;
}

.menu-button::before {
  content: "";
  margin-top: -8px;
}

.menu-button::after {
  content: "";
  margin-top: 8px;
}

#menu-toggle:checked + .menu-button-container .menu-button::before {
  margin-top: 0px;
  transform: rotate(405deg);
}

#menu-toggle:checked + .menu-button-container .menu-button {
  background: rgba(255, 255, 255, 0);
}

#menu-toggle:checked + .menu-button-container .menu-button::after {
  margin-top: 0px;
  transform: rotate(-405deg);
}

@media (max-width: 700px) {
  .separator {
    display: none;
  }
  .menu {
    position: absolute;
    top: 60px;
    left: 0;
    flex-direction: column;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    list-style-type: none;
    padding-left: 0;
    transition: all 0.3s ease;
    overflow: hidden;
    max-height: 0;
  }

  .menu-button-container {
    display: flex;
  }

  #menu-toggle:checked ~ .menu {
    max-height: 300px;
    padding: 20px 0;
  }

  .menu > li {
    display: block;
    width: 100%;
    text-align: left;
    padding: 8px 16px;
    /* border-bottom: 1px solid #eee; */

    display: flex;
    justify-content: flex-end;
  }

  .menu > li:last-child {
    border-bottom: none;
  }
}
</style>

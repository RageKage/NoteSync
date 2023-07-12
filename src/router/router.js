// Import necessary modules
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Create the router instance with the specified routes
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/Home.vue"),
      meta: { title: "Home" },
    }
    ,
    {
      path: "/register",
      component: () => import("../views/Register.vue"),
      meta: { title: "Register" },
    },
    {
      path: "/new-note",
      name: "New Note",
      component: () => import("../views/NewNote.vue"),
      meta: {
        requireAuth: true, // Specify that this route requires authentication
        title: "New Note",
      },
    },
    ,
    {
      path: "/testing",
      name: "Testing",
      component: () => import("../views/a.vue"),
      meta: {
        requireAuth: true, // Specify that this route requires authentication
        title: "New Note",
      },
    },
    {
      path: "/my-notes",
      name: "My Notes",
      component: () => import("../views/userNotes.vue"),
      meta: {
        requireAuth: true, // Specify that this route requires authentication
        title: "My Notes",
      },
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/profilePage.vue"),
      meta: {
        requireAuth: true,
        title: "Profile",
      },
    },
    {
      path: "/resetPassword",
      name: "resetPassword",
      component: () => import("../views/passwordresetPage.vue"),
      meta: {
        title: "Reset Password",
      },
    },
    {
      // This is a catch-all route for any paths that don't match the above routes
      path: "/:pathMatch(.*)*",
      // Define the name for this catch-all route
      name: "Error",
      // Define the component that will be displayed when this route is active
      component: () => import("../views/Errorpage.vue"),
      meta: { title: "Error" },
    },
  ],
  linkActiveClass: "header-active-link",
});

// Helper function to get the currently authenticated user
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    // Listen for changes in the authentication state
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener(); // Remove the listener once the user is retrieved
        resolve(user);
      },
      reject
    );
  });
};

// Before each navigation, check if the user is authenticated and has access to the requested route
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    // Check if the route requires authentication
    if (await getCurrentUser()) {
      // Check if the user is authenticated
      next(); // Allow the navigation to proceed
    } else {
      alert("You don't have Access"); // Show an error message if the user is not authenticated
      next("/sign-in"); // Redirect to the sign-in page
    }
  } else {
    next(); // Allow the navigation to proceed
  }
});

router.afterEach((to) => {
  document.title = to.meta.title || "Default Title";
});

export default router; // Export the router instance for use in other parts of the application

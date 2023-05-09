// src/stores/authUser.js
import { defineStore } from "pinia";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getDatabase,
  ref as dbRef,
  set as dbSet,
  get,
} from "firebase/database";

export const useAuthUserStore = defineStore("authUser", () => {
  const registerOrSignIn = async (email, password, isSignIn) => {
    const auth = getAuth();
    try {
      let userCredential;
      if (isSignIn) {
        // sign in with the same email and password
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        // if a new user then create a new account for them
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
      const user = userCredential.user;

      // Save user data to the "users" collection in Firebase Realtime Database
      // Only save data for new users (not signing in)
      if (!isSignIn) {
        const db = getDatabase();
        const usersRef = dbRef(db, "users/" + user.uid);
        await dbSet(usersRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      }

      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(getAuth(), provider);
      const user = result.user;

      // Check if user already exists in Firebase Realtime Database
      const db = getDatabase();
      const usersRef = dbRef(db, "users/" + user.uid);
      const userSnapshot = await get(usersRef);
      if (!userSnapshot.exists()) {
        // Save user data to the "users" collection in Firebase Realtime Database
        await dbSet(usersRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      }

      return { success: true, user };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const generateString = (length) => {
    // this will generate a unique id that is 8 characters long and unique when called
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let uniqueId = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueId += characters[randomIndex];
    }

    return uniqueId;
  };

  const createGuest = () => {
    const username = `guest_${generateString(8)}`;
    const password = `guest_${generateString(12)}`;

    return { username, password };
  };

const signInAsGuest = async () => {
  const auth = getAuth();
  const { username, password } = createGuest();

  let userCredential = await createUserWithEmailAndPassword(
    auth,
    `${username}@noteSync.com`,
    password
  );

  const user = userCredential.user;
  const db = getDatabase();
  const usersRef = dbRef(db, "guests/" + user.uid); // Use user.uid instead of username
  await dbSet(usersRef, {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  });

  let email = user.email;

  // Return the guest credentials to display them in a modal
  return { email, password };
};

  

  return {
    registerOrSignIn,
    signInWithGoogle,
    signInAsGuest,
  };
});

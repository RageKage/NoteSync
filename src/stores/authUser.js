import { defineStore } from "pinia";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import {
  getDatabase,
  ref as dbRef,
  set as dbSet,
  get,
} from "firebase/database";

export const useAuthUserStore = defineStore("authUser", () => {
  const guestImg =
    "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.jpg";

  // Function definitions
  const registerOrSignIn = async (email, password, name, isSignIn) => {
    // by isSignIn is set to true so that they can login if they are in the
    const auth = getAuth();
    try {
      let userCredential;
      if (isSignIn) {
        // this is to signin
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        // this is to create a new user
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
      const user = userCredential.user;

      if (!isSignIn) {
        // if the user is not signed in then create them an account
        const db = getDatabase();
        const usersRef = dbRef(db, "users/" + user.uid);
        await dbSet(usersRef, {
          email: user.email,
          displayName: name,
          photoURL: guestImg,
        });

        // Update the user's profile
        await updateProfile(user, {
          displayName: name,
          photoURL: guestImg,
        });

        await addUserEmailToDatabase(user.email, user.uid);
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

        await addUserEmailToDatabase(user.email, user.uid);
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

    console.log("wait")

    await addUserEmailToDatabase(user.email, user.uid);

    let email = user.email;

    // Return the guest credentials to display them in a modal
    return { email, password };
  };

  const resetPassword = async (email) => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const addUserEmailToDatabase = async (email, uid) => {
    const db = getDatabase();
    const emailKey = emailToKey(email);
    const userEmailRef = dbRef(db, `user_emails/users/${emailKey}`);
    await dbSet(userEmailRef, uid);
  };

  const emailToKey = (email) => {
    return email.replace(/[.#$\[\]]/g, "_");
  };

  return {
    registerOrSignIn,
    signInWithGoogle,
    signInAsGuest,
    resetPassword,
  };
});

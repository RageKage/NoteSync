// Import required packages
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref as dbRef,
  get as dbGet,
  set as dbSet,
  update as dbUpdate,
} from "firebase/database";
import { ref } from "vue";
import Swal from "sweetalert2";

// This function handles the sharing of notes between users
export default function useSharing(notes, email) {
  // Section 1: Utility Functions

  // Converts email to a Firebase-friendly key
  const emailToKey = (email) => {
    return email.replace(/[.$\[\]#/]/g, "_");
  };

  // Checks if a user exists in the database based on their email
  const userExists = async (email) => {

    const db = getDatabase();
    const userEmailKey = emailToKey(email);
    const userEmailsRef = dbRef(db, "user_emails/users/" + userEmailKey);

    console.log(userEmailsRef)
    const snapshot = await dbGet(userEmailsRef);

    if (snapshot.exists()) {


      const uid = snapshot.val();
      const isGuest = email.endsWith("@notesync.com");
      const collection = isGuest ? "guests" : "users";
      const userRef = dbRef(db, `${collection}/${uid}`);
      try {
        const userSnapshot = await dbGet(userRef);
        return {
          uid: uid,
          ...userSnapshot.val(),
        };
      } catch (error) {
        console.error("Error getting user snapshot:", error);
        return false;
      }
    }
  };

  // Section 2: Core Functions

  // Retrieves the current user and loads their notes
  const getCurrentUser = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      loadNotes(user);
    }
    return user;
  };

  // Shares a note with another user
  const shareNote = async (noteID, noteData) => {
    const receiver = await userExists(email.value);

    const auth = getAuth();
    const currentUser = auth.currentUser;
    const note = notes.value.find((note) => note.id === noteID);

    // console.log(receiver)

    // Validate email and receiver
    if (!email.value) {
      email.value = "";
      return Swal.fire({
        text: `Please add the email you're sending to.`,
        icon: "info",
      });
    } else if (!receiver) {
      email.value = "";
      return Swal.fire({
        text: `The email you're sending to does not exist in our database.`,
        icon: "error",
      });
    }

    // Share note if current user exists
    if (getCurrentUser()) {
      const db = getDatabase();
      const isGuest = receiver.email.endsWith("@notesync.com");
      const collection = isGuest ? "guests" : "users";
      const receiverUid = receiver.uid;
      const receiverNoteRef = dbRef(
        db,
        `${collection}/${receiverUid}/notes/${noteID}`
      );
      await dbSet(receiverNoteRef, noteData);

      // Handle shared note collection
      const sharedNoteRef = dbRef(db, `shared_notes/${noteID}`);
      const sharedNoteData = {
        noteData: {
          title: note.title,
          content: note.content,
          createdAt: note.date,
        },
        recipients: {
          [receiverUid]: {
            sharedBy: currentUser.uid,
            sharedWith: {
              [currentUser.uid]: true,
            },
          },
        },
      };
      const sharedNoteSnapshot = await dbGet(sharedNoteRef);
      if (sharedNoteSnapshot.exists()) {
        await dbUpdate(sharedNoteRef, sharedNoteData);
      } else {
        await dbSet(sharedNoteRef, sharedNoteData);
      }
    }
  };

  // Loads the notes of the current user
  const loadNotes = async (user) => {
    const db = getDatabase();
    const isGuest = user.email.endsWith("@notesync.com");
    const collection = isGuest ? "guests" : "users";
    const notesRef = dbRef(db, `${collection}/${user.uid}/notes`);
    try {
      const snapshot = await dbGet(notesRef);
      const data = snapshot.val();
      if (data) {
        const notesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        notes.value = notesArray;
      }
    } catch (error) {
      console.error(error);
    }
  };


  return {
    shareNote,
    userExists,
    loadNotes,
    getCurrentUser,
    notes,
  };
}

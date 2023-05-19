// Import required packages
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref as dbRef,
  get as dbGet,
  set as dbSet,
  update as dbUpdate,
  onValue,
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

    console.log(userEmailsRef);
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
        originalSharer: currentUser.uid,
        recipients: {
          [receiverUid]: true,
        },
      };
      const sharedNoteSnapshot = await dbGet(sharedNoteRef);
      if (sharedNoteSnapshot.exists()) {
        const existingData = sharedNoteSnapshot.val();

        // instead of overwriting the existing data add the new data of recipients

        existingData.recipients[receiverUid] = true;

        await dbSet(sharedNoteRef, existingData);

        if (currentUser.uid !== existingData.originalSharer) {
          // update existing note object when shared back
          const SharerNoteRef = dbRef(
            db,
            `users/${existingData.originalSharer}/notes/${noteID}`
          );
          await dbSet(sharedNoteRef, SharerNoteRef);
        }
      } else {
        await dbSet(sharedNoteRef, sharedNoteData);
      }
    }
  };

  // load the notes of the current user
  const loadNotes = async (user) => {
    const db = getDatabase();
    const isGuest = user.email.endsWith("@notesync.com");
    const collection = isGuest ? "guests" : "users";
    const notesRef = dbRef(db, `${collection}/${user.uid}/notes`);

    onValue(
      notesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const notesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          notes.value = notesArray;

          // save notes to local storage
          localStorage.setItem(`${user.uid}/notes`, JSON.stringify(notesArray));
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const noteSharedLabel = async (NoteID) => {
    // show the user notes that are shared with them and notes they shared
    const currentUser = getCurrentUser();
    const db = getDatabase();
    const sharedNoteRef = dbRef(db, `shared_notes/${NoteID}`);

    const snapshot = await dbGet(sharedNoteRef);
    if (snapshot.exists()) {
      const sharedNoteData = snapshot.val();
      // check if a note has been shared with them
      if (sharedNoteData.recipients[currentUser.uid]) {
        return { isShared: true, sharedStatus: "Shared with you." };
      }

      // check if they shared a note
      if (sharedNoteData.originalSharer === currentUser.uid) {
        return { isShared: true, sharedStatus: "Shared" };
      }
    }
    return { isShared: false, sharedStatus: "" };
  };

  return {
    shareNote,
    userExists,
    loadNotes,
    getCurrentUser,
    notes,
    noteSharedLabel,
  };
}

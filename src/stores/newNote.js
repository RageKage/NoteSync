import { ref } from "vue";
import { defineStore } from "pinia";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef, set as dbSet } from "firebase/database";

export const useNotesStore = defineStore("notes", () => {
  const notes = ref([]);

  // Function definitions
  const getCurrentUser = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    return user;
  };
  const generateUniqueId = (length = 8) => {
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
  const addNote = (title, content) => {
    // will be passed a title and content

    // create a uniqueId for the note instead of the one created by firebase
    const uniqueId = generateUniqueId();

    const newNote = {
      // new note object with the given title and content
      
      id: uniqueId,
      title: title,
      content: content,
      date: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      }),
    };

    if (!newNote.title) {
      return Swal.fire({
        text: `You need to add a Title`,
        icon: "info",
      });
    } else if (!newNote.content) {
      return Swal.fire({
        text: `You need to add content`,
        icon: "info",
      });
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      // if current user is logged in then go ahead and save that under the current user notes collection
      const db = getDatabase();

      // Determine the current user is a guest
      const isGuest = currentUser.email.endsWith("@notesync.com");
      // console.log("Is Guest:", isGuest);

      // if a user then go save their note in the notes collection if guest then go ahead and save their note in the guests notes collection
      const collection = isGuest ? "guests" : "users";

      const noteRef = dbRef(
        db,
        `${collection}/${currentUser.uid}/notes/${uniqueId}`
      );

      // console.log(noteRef);

      dbSet(noteRef, newNote);
      console.log(noteRef, newNote);
    }
  };

  return {
    notes,
    getCurrentUser,
    addNote,
  };
});

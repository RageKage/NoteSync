import { ref, onMounted, watchEffect } from "vue";
import { getAuth, signOut } from "firebase/auth";
import Swal from "sweetalert2";
import {
  getDatabase,
  ref as dbRef,
  push as dbPush,
  get as dbGet,
  set as dbSet,
  remove as dbRemove,
  update as dbUpdate,
  onValue,
} from "firebase/database";

export default function useNotes() {
  // main ref
  const noteToEdit = ref({});
  const notes = ref([]);
  const isOpen = ref(false);
  const noteTitle = ref("");
  const noteContent = ref("");
  const editingNote = ref(false);

  // share refs
  const email = ref(null);
  const noteToShare = ref(null);
  const shareOpen = ref(false);

  // searching refs
  const searchWords = ref(""); 
  const searchResults = ref([]); // Array to store the search results
  const searchResultsModalOpen = ref(false);

  onMounted(() => {
    getCurrentUser();
  });

  // opening and closing a modal window
  const closeModal = () => {
    isOpen.value = false;
    editingNote.value = false;
  };

  const showShareModal = (note) => {
    const alertKey = "ShowShareAlert";
    const alert = localStorage.getItem(alertKey); // use the local storage to show the alert once

    console.log("shareNote called, alert value:", alert); // Add this line to check the value of alert

    if (!alert) {
      Swal.fire({
        icon: "info",
        title: "Attention!",
        text: "For now you can share notes with users that have an account with us",
      }).then(() => {
        localStorage.setItem(alertKey, true); // set localStorage only after the alert is shown
      });
    }

    noteToShare.value = note;
    shareOpen.value = true;
  };

  const closeShareModal = () => {
    shareOpen.value = false;
  };

  // Functions

  const getCurrentUser = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    return user;
  };

  // editing a notes
  const editNoteText = (id) => {
    // this will find the id of the note that was clicked and then show them that content in the modal
    isOpen.value = true;
    for (let i = 0; i < notes.value.length; i++) {
      if (notes.value[i].id === id) {
        editingNote.value = true;
        noteToEdit.value = {
          ...notes.value[i],
          index: i,
        };
        noteTitle.value = notes.value[i].title;
        noteContent.value = notes.value[i].content;

        break;
      }
    }
  };

  const updateNote = (noteToEditRef) => {
    // Update the note reference from the editNoteText
    console.log("note T oEdit Ref:", noteToEditRef);

    if (editingNote.value) {
      const note = noteToEditRef;
      const uniqueId = note.id; // get the note id

      const updatedNote = {
        // update the note with the new content or title
        id: uniqueId,
        title: note.title,
        content: note.content,
        date: new Date().toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "2-digit",
        }),
      };

      if (!updatedNote.title) {
        return Swal.fire({
          text: `You can't set the title empty when updating it`,
          icon: "info",
        });
      } else if (!updatedNote.content) {
        return Swal.fire({
          text: `You can't set the content empty when updating it`,
          icon: "info",
        });
      }

      console.log("updatedNote:", updatedNote);

      const auth = getAuth();
      const currentUser = auth.currentUser; // auth the user

      if (currentUser) {
        // if the user is authenticated then continue
        const db = getDatabase(); // get the database

        console.log(updatedNote);

        const isGuest = currentUser.email.endsWith("@notesync.com");

        const collection = isGuest ? "guests" : "users";

        // get the notes of the current user
        const noteRef = dbRef(
          db,
          `${collection}/${currentUser.uid}/notes/${note.id}`
        );

        dbUpdate(noteRef, updatedNote) // note this will go ahead and use the note reference and update it with the new note Object
          .then(() => {
            console.log("Note updated in the database");
            const noteIndex = notes.value.findIndex((n) => n.id === uniqueId);
            if (noteIndex > -1) {
              notes.value.splice(noteIndex, 1, updatedNote);
            } else {
              console.error("Cannot find note with id:", uniqueId);
            }

            // Close the modal and reset the form and editing state
            closeModal();
            noteTitle.value = "";
            noteContent.value = "";
            editingNote.value = false;
            noteToEdit.value = {};
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  // deleting a note by id
  const deleteNote = (id) => {
    const auth = getAuth();

    // current authenticated user
    const currentUser = auth.currentUser;

    if (currentUser) {
      const db = getDatabase();

      for (let i = 0; i < notes.value.length; i++) {
        if (notes.value[i].id === id) {
          const noteKey = notes.value[i].id;

          if (noteKey) {
            Swal.fire({
              text: `Are you sure you want to remove ${notes.value[i].title} ?`,
              icon: "warning",
              showCancelButton: true,
            }).then((result) => {
              if (result.value) {
                const isGuest = currentUser.email.endsWith("@notesync.com");
                const collection = isGuest ? "guests" : "users";

                // get the notes of the current user
                const noteRef = dbRef(
                  db,
                  `${collection}/${currentUser.uid}/notes/${noteKey}`
                );

                // this should remove the note from the database
                dbRemove(noteRef)
                  .then(() => {
                    // remove from the array as well
                    notes.value.splice(i, 1);
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              } else {
                // The user clicked "Cancel"
                // Do nothing
              }
            });
          }
          break;
        }
      }
    }
  };

  const searchNotes = () => {
    const auth = getAuth();

    const isGuest = auth.currentUser.email.endsWith("@notesync.com");

    const collection = isGuest ? "guests" : "users";

    const db = getDatabase();
    const noteRef = dbRef(db, `${collection}/${auth.currentUser.uid}/notes`);

    onValue(noteRef, (snapshot) => {
      const notes = snapshot.val();
      if (notes) {
        const matchingNotes = Object.values(notes).filter(
          (note) =>
            note.title.toLowerCase() === searchWords.value.toLowerCase() ||
            note.date === searchWords.value
        );
        searchResults.value = matchingNotes;
        searchResultsModalOpen.value = true;
      }
    });

    searchWords.value = "";
  };

  const onPressEnter = (e) => {
    if (e.key == "Enter") {
      const auth = getAuth();

      const isGuest = auth.currentUser.email.endsWith("@notesync.com");

      const collection = isGuest ? "guests" : "users";

      const db = getDatabase();
      const noteRef = dbRef(db, `${collection}/${auth.currentUser.uid}/notes`);

      onValue(noteRef, (snapshot) => {
        const notes = snapshot.val();
        if (notes) {
          const matchingNotes = Object.values(notes).filter(
            (note) =>
              note.title.toLowerCase() === searchWords.value.toLowerCase() ||
              note.date === searchWords.value
          );
          searchResults.value = matchingNotes;
          searchResultsModalOpen.value = true;
        }
      });

      searchWords.value = "";
    }
  };

  const closeSearchResultsModal = () => {
    searchResultsModalOpen.value = false; // Close the search results modal
  };

  return {
    editNoteText,
    noteToEdit,
    notes,
    isOpen,
    noteTitle,
    noteContent,
    editingNote,
    closeModal,
    updateNote,
    deleteNote,
    showShareModal,
    shareOpen,
    noteToShare,
    closeShareModal,
    getCurrentUser,
    email,
    onPressEnter,
    closeSearchResultsModal,
    searchNotes,
    searchWords,
    searchResults,
    searchResultsModalOpen,
  };
}

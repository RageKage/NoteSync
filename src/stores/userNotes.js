import { defineStore } from "pinia";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref as dbRef,
  push as dbPush,
  get as dbGet,
  set as dbSet,
  remove as dbRemove,
  update as dbUpdate,
} from "firebase/database";
import { ref, computed, watch , reactive} from "vue";

export const useUserNotesStore = defineStore("userNotes", () => {
//   const notes = ref([]);
const notes = reactive({});


  const isOpen = ref(false);
  const noteToEdit = ref({});
  const noteTitle = ref("");
  const noteContent = ref("");
  const editingNote = ref(false);



  const editNoteText = (id) => {

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

  const closeModal = () => {
    isOpen.value = false;
    editingNote.value = false; // Reset editing state when closing the modal
  };

  const updateNote = async (noteToEditRef) => {


    if (editingNote.value) {
      const note = noteToEditRef;
      const uniqueId = note.id; // get the note id

      const updatedNote = {
        // update the note with the new content or title
        id: uniqueId,
        title: note.title,
        content: note.content,
      };

      console.log("updatedNote:", updatedNote);

      const auth = getAuth();
      const currentUser = auth.currentUser; // auth the user

      if (currentUser) {
        // if the user is authenticated then continue
        const db = getDatabase(); // get the database

        console.log(updatedNote);

        const noteRef = dbRef(
          db,
          "users/" + currentUser.uid + "/notes/" + note.id
        ); // create a note reference using the note id

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

  const deleteNote = (id) => {

    console.log(notes.value)
    const auth = getAuth();
  
    // current authenticated user
    const currentUser = auth.currentUser;
  
    if (currentUser) {
      const db = getDatabase();
  
      if (notes.value) {
        for (let i = 0; i < notes.value.length; i++) {
          if (notes.value[i].id === id) {
            const noteKey = notes.value[i].id;
  
            // a reference to the user's notes in the database
            const noteRef = dbRef(
              db,
              "users/" + currentUser.uid + "/notes/" + noteKey
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
  
            break;
          }
        }
      }
    }
  };
  
   




  return {
    editNoteText,
    closeModal,
    updateNote,
    deleteNote,
    notes,
    isOpen,
    noteTitle,
    noteContent,
    noteToEdit,
  };
});

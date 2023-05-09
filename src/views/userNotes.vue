<template>

  <div>
    <template v-if="notes && notes.length > 0">
      <div class="notes-app">
        <section class="notes-list">
          <header class="notes-header">
            <h2>My Notes</h2>
          </header>
          <div class="notes-container">
            <div v-for="note in notes" :key="note.id" class="note-item">
              <div class="note-details">
                <h3 class="note-title title">
                  Title: <b class="bold">{{ note.title }}</b>
                </h3>
                <p class="note-date"><b>Date created:</b> {{ note.date }}</p>
                <p class="note-content">{{ note.content }}</p>
              </div>
              <div class="note-actions">
                <button class="btn edit-btn" @click="editNoteText(note.id)">
                  Edit
                </button>
                <teleport to="body">
                  <div v-if="isOpen && noteToEdit.id === note.id">
                    <div class="modal-overlay" @click="closeModal"></div>
                    <div class="modal">
                      <h2>Edit Note</h2>
                      <label for="edit-note-title">Title:</label>
                      <input id="edit-note-title" v-model="noteToEdit.title" />
                      <label for="edit-note-content">Content:</label>
                      <textarea
                        id="edit-note-content"
                        v-model="noteToEdit.content"
                      ></textarea>
                      <div class="note-actions">
                        <button
                          class="btn"
                          type="submit"
                          @click="updateNote(noteToEdit)"
                        >
                          Save Note
                        </button>
                        <button class="btn secondary" @click="closeModal">
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </teleport>

                <button class="btn delete-btn" @click="deleteNote(note.id)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
    <template v-else>
      <div class="empty-notes">
        <h2>No Notes Found</h2>
        <p>It looks like you haven't created any notes yet.</p>
        <router-link to="/new-note" class="cta-button">
          Start Writing!
        </router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
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
} from "firebase/database";

const noteToEdit = ref({});
const notes = ref([]);
const isOpen = ref(false);

const noteTitle = ref("");
const noteContent = ref("");
const editingNote = ref(false);

onMounted(() => {
  getCurrentUser();
});

const getCurrentUser = () => {
  // get current user
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    loadNotes(user);
  }
  return user;
};

const editNoteText = (id) => {
  // this will find the id of the note that was clicked and then show them that content
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
  // close modal
  isOpen.value = false;
  editingNote.value = false; // Reset editing state when closing the modal
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

const loadNotes = async (user) => {
  // this will load the notes of the current user
  const db = getDatabase(); // get the database

  // check if the user has a @notesync.com
  const isGuest = user.email.endsWith("@notesync.com");

  const collection = isGuest ? "guests" : "users";
  // const notesRef = dbRef(db, "users/" + user.uid + "/notes");
  // get the notes of the current user
  const notesRef = dbRef(db, `${collection}/${user.uid}/notes`);

  try {
    const snapshot = await dbGet(notesRef); // get the snapshot of the notes of the current user
    const data = snapshot.val();
    if (data) {
      // if the data exists, then turn it into a an array and add it to the notes
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

</script>

<style scoped>


.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}
.modal h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
}
input,
textarea {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 1rem;
  margin-bottom: 1rem;
  flex: 1;
  word-wrap: break-word;

  max-height: 400px;
  max-width: 800px;
  min-width: 300px;
  min-width: 400px;

  overflow: auto;
}

.note-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.btn {
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  color: #fff;
  background-color: #07c;
  border: none;
  cursor: pointer;
}
.btn.secondary {
  background-color: #999;
  margin-right: 0.5rem;
}
.btn:hover {
  opacity: 0.8;
}
.btn:active {
  transform: translateY(1px);
}
body {
  background-color: #f5f5f5;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
}
* {
  padding: 0;
  box-sizing: border-box;
}
body {
  background-color: #f1f1f1;
  font-family: "Helvetica Neue", sans-serif;
}
.notes-app {
  margin: 50px auto;
  max-width: 1200px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.notes-header {
  text-align: center;
  margin-bottom: 30px;
}
.notes-header h1 {
  font-size: 2.5rem;
  color: #444;
}
label {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #666;
}
input[type="text"],
textarea {
  height: 200px;

  width: 100%;
  padding: 10px;
  font-size: 1.2rem;
  border-radius: 4px;
  border: 2px solid #ccc;
  transition: border-color 0.3s ease-in-out;
}
input[type="text"]:focus,
textarea:focus {
  outline: 0;
  border-color: #6d9eeb;
}
button.btn {
  padding: 10px 20px;
  font-size: 1.2rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}
button.secondary {
  background-color: #f1f1f1;
  color: #666;
}
button.secondary:hover {
  background-color: #e1e1e1;
}
.notes-list {
  margin-top: 40px;
}
.notes-list h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #444;
}
.note-details {
  flex: 1;
  word-wrap: break-word;
  max-height: 300px;
  overflow: auto;
  background-color: #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin: 10px;
  padding: 20px;
  transition: transform 0.2s ease-in-out;
}
.note-details:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.note-details h3 {
}
.note-details p.old {
  font-size: 1.2rem;
  color: #666;
  margin-top: 5px;
}
old {
  overflow: auto;
}
date {
  align-items: left;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}
.note-title {
  color: #666;
}
.bold {
  color: black;
}

.note-actions {
  display: flex;
  align-items: center;
  padding-bottom: 2rem;
}
.note-actions button {
  margin-left: 10px;
}
.note-actions button.edit-btn {
  background-color: #6d9eeb;
  color: #fff;
}
.note-actions button.edit-btn:hover {
  background-color: #4c7ebd;
}
.note-actions button.delete-btn {
  background-color: #f1f1f1;
  color: #666;
}
.note-actions button.delete-btn:hover {
  background-color: #f27474;
  color: #fff;
}

.empty-notes {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 20px;
}

.empty-notes h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.empty-notes p {
  font-size: 18px;
  margin-bottom: 20px;
}

.cta-button {
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 16px;
}

.cta-button:hover {
  background-color: #3e8e41;
}

/* 768px */
@media screen and (min-width: 700px) {
  .notes-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .note-item {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    width: calc(50% - 20px);
    height: 400px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
  }

  .note-details {
    flex: 1;
    word-wrap: break-word;
    max-height: 300px;
    overflow: auto;
    background-color: #f1f1f1;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin: 10px;
    padding: 20px;
    transition: transform 0.2s ease-in-out;
  }

  .note-actions {
    display: flex;
    align-items: center;
    margin-top: auto;
  }
}
</style>

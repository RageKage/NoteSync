<template>
  <!-- Root container -->
  <div class="root-container">
    <!-- Note list container -->
    <div class="note-list-container">
      <!-- Check if notes exist -->
      <template v-if="notes && notes.length > 0">
        <!-- Notes Section -->
        <div class="notes-section">
          <!-- Section for each note -->
          <section class="note-section">
            <!-- Header of the note section -->
            <header class="note-header">
              <h2 class="title">MY NOTES</h2>

              <!-- Search bar -->
              <div class="search-bar">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Search By Title"
                  v-model="searchWords"
                  @input="searchNotes"
                  class="search-input"
                />
                <button @click="searchNotes" class="search-button"></button>
              </div>
            </header>

            <!-- Search Results Modal -->
            <div v-if="searchResultsModalOpen" class="search-results-modal">
              <h2 class="search-results-title">Search Results:</h2>
              <!-- Search Results Container -->
              <div class="search-results-container">
                <!-- If search results exist -->
                <div
                  v-if="searchResults.length > 0"
                  class="search-results-exist"
                >
                  <!-- Iterating through search results -->
                  <div
                    v-for="note in searchResults"
                    :key="note.id"
                    class="search-result-item"
                  >
                    <!-- Note details -->
                    <div class="note-details">
                      <h3 class="note-title">
                        <b>{{ note.title }}</b>
                      </h3>
                      <p class="note-date">
                        <b>Date created:</b> {{ note.date }}
                      </p>
                    </div>

                    <!-- Note actions -->
                    <div class="note-actions">
                      <button
                        @click="editNoteText(note.id)"
                        class="edit-button"
                      >
                        EDIT
                      </button>
                      <button
                        @click="showShareModal(note)"
                        class="share-button"
                      >
                        SHARE
                      </button>
                      <button
                        @click="deleteNote(note.id)"
                        class="delete-button"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
                <!-- If no search results found -->
                <div v-else class="no-search-results">
                  <p>NO MATCHING NOTES FOUND.</p>
                </div>
                <button
                  @click="closeSearchResultsModal"
                  class="close-search-modal-button"
                ></button>
              </div>
            </div>

            <!-- Note items container -->
            <div class="note-items-container">
              <!-- Iterating through notes -->
              <div v-for="note in notes" :key="note.id" class="note-item">
                <!-- Note content -->
                <div class="note-content">
                  <!-- Note title and date -->
                  <div class="note-title-date">
                    <h3
                      :data-fulltitle="note.title"
                      class="note-title ellipsis"
                    >
                      <b>{{ note.title }}</b>
                    </h3>

                    <div class="note-date-sharedstatus">
                      <div class="note-date-container">
                        <p class="note-date">{{ note.date }}</p>
                      </div>
                      <div class="note-shared-status-container">
                        
                        <p
                          @mouseover="hover = note.id"
                          @mouseleave="hover = null"
                          v-if="
                            (hover === note.id &&
                              sharedNotes[note.id] &&
                              sharedNotes[note.id].sharerEmail) ||
                            (sharedNotes[note.id] &&
                              sharedNotes[note.id].sharedStatus)
                          "
                          class="note-shared-status"
                        >
                          <span
                            v-if="
                              hover === note.id &&
                              sharedNotes[note.id] &&
                              sharedNotes[note.id].sharerEmail
                            "
                            class="note-shared-email"
                          >
                            {{ sharedNotes[note.id].sharerEmail }}
                          </span>
                          <span v-else class="note-shared-status-text">
                            {{ sharedNotes[note.id].sharedStatus }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <p class="note-body">{{ note.content }}</p>
                </div>
                <!-- Note actions -->
                <div class="note-actions">
                  <button @click="editNoteText(note.id)" class="edit-button">
                    EDIT
                  </button>

                  <!-- Teleport for modals -->
                  <teleport to="body">
                    <div
                      v-if="isOpen && noteToEdit.id === note.id"
                      class="edit-note-modal"
                    >
                      <!-- Close Modal button -->
                      <div class="modal-overlay-share" @click="closeModal"></div>
                      <!-- Edit Note Modal Content -->
                      <div class="edit-note-modal-content" >
                        <h2 class="modal-title">EDITING NOTE</h2>
                        <label for="edit-note-title" class="label-title"
                          >Title:</label
                        >
                        <input
                          id="edit-note-title"
                          v-model="noteToEdit.title"
                          class="input-title"
                        />
                        <label for="edit-note-content" class="label-content"
                          >Content:</label
                        >
                        <textarea
                          id="edit-note-content"
                          v-model="noteToEdit.content"
                          class="textarea-content"
                        ></textarea>
                        <!-- Modal actions -->
                        <div class="modal-actions">
                          <button
                            type="submit"
                            @click="updateNote(noteToEdit)"
                            class="save-note-button"
                          >
                            SAVE NOTE
                          </button>
                          <button @click="closeModal">CLOSE</button>
                        </div>
                      </div>
                    </div>
                  </teleport>

                  <div class="note-share-delete-actions">
                    <button @click="showShareModal(note)" class="share-button">
                      SHARE
                    </button>

                    <teleport to="body">
                      <div
                        v-if="shareOpen && noteToShare.id === note.id"
                        class="share-modal"
                      >
                        <!-- Close Share Modal button -->
                        <div class="modal-overlay-share" @click="closeShareModal"></div>
                        <!-- Share Modal Content -->
                        <div class="share-modal-content">
                          <h2 class="modal-title">
                            Who are you sending it to?
                          </h2>
                          <label for="share-email" class="label-email"
                            >Email:</label
                          >
                          <input
                            id="share-email"
                            v-model="email"
                            class="input-email"
                          />
                          <!-- Modal actions -->
                          <div class="modal-actions">
                            <button
                              type="submit"
                              @click="shareNote(noteToShare.id, noteToShare)"
                              class="share-note-button"
                            >
                              Search and send
                            </button>
                            <button @click="closeShareModal">CLOSE</button>
                          </div>
                        </div>
                      </div>
                    </teleport>

                    <button @click="deleteNote(note.id)" class="delete-button">
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </template>

      <!-- If no notes found -->
      <template v-else>
        <!-- No notes message container -->
        <div class="no-notes-message-container">
          <h2 class="no-notes-title">No Notes Found</h2>
          <p class="no-notes-message">
            It looks like you haven't created any notes yet.
          </p>
          <!-- Router link to create a new note -->
          <router-link to="/new-note" class="new-note-link">
            Start Writing!
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { getAuth, signOut } from "firebase/auth";
import Swal from "sweetalert2";
import '@/assets/dark.scss'
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
import useNotes from "../composables/useNotes.js";
import useSharing from "../composables/useSharing.js";

// Composables
const {
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
  email,
  closeSearchResultsModal,
  searchNotes,
  searchWords,
  searchResults,
  searchResultsModalOpen,
} = useNotes();

const { shareNote, userExists, loadNotes, getCurrentUser, noteSharedLabel } =
  useSharing(notes, email);

const sharedNotes = ref({}); // Create a ref to store IDs of shared notes

const hover = ref(false);

watchEffect(async () => {
  // update the shared notes when a change is made, this will show the user the notes they shared and nots shared to them
  // returns the end-user email which is then shown to the current user
  const sharedNotesPromises = notes.value.map(async (note) => {
    const sharedNoteInfo = await noteSharedLabel(note.id);
    return [note.id, sharedNoteInfo || { isShared: false, sharedStatus: null }];
  });

  const noteShares = await Promise.all(sharedNotesPromises);

  sharedNotes.value = Object.fromEntries(noteShares);


});

onMounted(() => {
  getCurrentUser();
  console.log(sharedNotes);
});
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  color: #fff;
  background-color: #000;
  padding: 20px;

  font-size: 16px;
}

@media screen and (max-width: 700px) {
  body {
    font-size: 14px; /* Reduced font size for screens under 700px wide */
  }
}

@media screen and (max-width: 300px) {
  body {
    font-size: 12px; /* Further reduced font size for screens under 300px wide */
  }
}

h2,
h3 {
  color: #000;
  margin-bottom: 20px;
}

button {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 10px;
  margin: 10px 0;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 4px 10px #0000001a;
}

button:hover {
  background-color: #fff;
  color: #000;
  border: 1px solid #000;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: #fff;
  color: #000;
}

.root-container {
  margin: 0 auto;
}

.notes-section,
.note-list-container {
  /* display: flex; */
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.note-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.search-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.edit-button,
.share-button,
.delete-button,
.new-note-link {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #333;
  color: #fff;
  background-color: #333;
}

.search-input {
  padding: 0.8em;
  font-size: 1em;
  border-radius: 50px;
  width: 250px;
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.1), 0 0 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  border-radius: 15px 50px 50px 15px;
  border: none;
  padding: 10px;
  outline: none;
  flex-grow: 1;
}

input,
optgroup,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  margin: 0;
  padding: 0;
}

.search-button {
  position: absolute;
  right: 0;
  height: 100%;
  width: 60px;
  border-radius: 50px;
  padding: 0;
  line-height: 0;
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.1), 0 0 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: 1px solid #333;
  color: #fff;
  background-color: #333;
}

.search-button:hover {
  background-color: #fff;
}

.search-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1), 0 0 0 rgba(0, 0, 0, 0.1);
}

.search-button:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-image: url("https://img.icons8.com/ios-glyphs/50/ffffff/search--v1.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100%;
}

.search-button:hover:before {
  background-image: url("https://img.icons8.com/ios-glyphs/50/333/search--v1.png");
}

.title {
  font-size: 30px;
}

@media screen and (min-width: 700px) {
  .search-input:hover {
    width: 450px;
    box-shadow: 0 2px 15px #0003, 0 0 0 4px #00afaf1a;
  }

  .title {
    font-size: 40px;
  }

  .note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-result-item {
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 10px;
  transition: background-color 0.2s ease-in-out;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
}

@media only screen and (max-width: 700px) {
  h1,
  h2,
  h4,
  h5,
  h6,
  p,
  .note-title,
  .note-date,
  .note-body,
  .label-title,
  .label-content,
  .no-notes-title,
  .no-notes-message {
    font-size: 0.87em; /* adjust this value to your needs */
  }

  .search-input {
    font-size: 0.8em;
  }

  .edit-button,
  .share-button,
  .delete-button,
  .save-note-button,
  .share-note-button {
    font-size: 0.8em; /* adjust this value to your needs */
  }

  .search-result-item {
    display: flex;
    flex-direction: column;
  }
}



.edit-button,
.share-button,
.delete-button {
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
}

.note-content {
  flex: 1;
  word-wrap: break-word;
  max-height: 300px;
  overflow: auto;
  margin-bottom: 1rem;
}

@media screen and (max-width: 700px) {
  .note-item {
    border: 1px solid #333;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px #0000001a;
    padding: 1rem;
    margin-bottom: 20px;
    height: 100%;
    max-height: 400px;
  }
}

@media screen and (min-width: 700px) {
  .note-items-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .note-item {
    border: 1px solid #333;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px #0000001a;
    padding: 1rem;
    width: calc(50% - 20px);
    height: 400px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
  }
}

/* .search-results-modal, */
.edit-note-modal,
.share-modal {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-results-modal {
  max-height: 500px;
  overflow: auto;
  position: relative;
  background-color: #fafafa;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
  /* max-width: 800px; */
  margin: 2em auto;
  margin-top: 20px;
}



.search-results-container {
  max-height: 400px;
  overflow-y: auto;
  color: #000;
  border-radius: 10px;
}

.edit-note-modal-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px #0000001a;
  padding: 16px;
  max-width: 800px;
  width: 100%;
  z-index: 1001;
  margin: 0 auto;
}
.share-modal-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px #0000001a;
  left: 50%;
  padding: 16px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  z-index: 1001;
}

textarea#edit-note-content {
  display: block;
  margin-bottom: 1rem;
  max-width: 800px;
  min-width: 400px;
  width: 100%;
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid #eeebeb;
  transition: border-color 0.3s ease-in-out;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  min-height: 289px;
  max-height: 350px;
  overflow: auto;
  resize: vertical;
}

input#edit-note-title {
  display: block;
  margin-bottom: 1rem;
  max-width: 800px;
  min-width: 400px;
  width: 100%;
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid #eeebeb;
  transition: border-color 0.3s ease-in-out;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: auto;
  resize: vertical;
}

.no-notes-message-container {
  text-align: center;
  padding: 20px;
  margin-top: 6rem;
}


.new-note-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  text-decoration: none;
}

.modal-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.notes-section {
  margin-top:1rem ;
  /* max-width: 1500px; */
  padding: 30px;
}


@media screen and (min-width: 700px) {
  .notes-section {
  margin-top:5rem ;
  /* max-width: 1500px; */
  padding: 30px;
}
}

.note-body {
  margin-top: 2rem;
}

input#share-email {
  border: 1px solid #333;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px #0000001a;
  padding: 5px;
}

.note-date {
  font-size: 12px;
  color: #888;
}

.close-search-modal-button {
  background: none;
  border: none;
  position: relative;
  height: 5rem;
  width: 5rem;
  cursor: pointer;
  transition: transform 0.5s ease;
  background-color: none;
  color: black;
  border: none;
  margin: 0 auto;
  display: flex;
  box-shadow: none;
}
.close-search-modal-button:hover {
  background-color: transparent;
  color: black;
  border: none;
  box-shadow: none;
}
.close-search-modal-button:hover {
  transform: rotate(180deg);
}

.close-search-modal-button::before,
.close-search-modal-button::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 2rem;
  background: #333;
}

.close-search-modal-button::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-search-modal-button::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.modal-overlay-share {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.modal-overlay-share {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* Shared Notif */
p.note-shared-status {
  text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 0em;
    display: inline-block;
    padding: 5px;
    font-size: 14px;
    padding-left: rem;
    background-color: #e1e0e0;
    color: #666;
    text-align: center;
    border: 1px solid #333;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px #0000001a;
    margin-top: 1rem;
    cursor: pointer;
}
</style>

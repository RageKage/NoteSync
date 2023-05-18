<template>
  <div>
    <!-- Modal for search results -->
    <div
      v-if="searchResultsModalOpen"
      class="modal-overlay-share"
      @click="closeSearchResultsModal"
    >
      <div class="modal-Search">
        <h2>Search Results:</h2>
        <div class="Search-actions">
          <div v-if="searchResults.length > 0">
            <div
              v-for="note in searchResults"
              :key="note.id"
              class="search-results"
            >
              <div class="Search-note-title">Title: {{ note.title }}</div>
              <div class="Search-note-content">Date: {{ note.date }}</div>
              <div class="Search-note-content">Content: {{ note.content }}</div>
            </div>
          </div>
          <div v-else class="no-results">
            <p>No matching notes found.</p>
          </div>
          <button class="btn secondary" @click="closeSearchResultsModal">
            Close
          </button>
        </div>
      </div>
    </div>

    <template v-if="notes && notes.length > 0">
      <div class="notes-app">
        <section class="notes-list">
          <header class="notes-header">
            <h2>My Notes</h2>

            <div class="search">
              <input
                type="text"
                id="searchInput"
                class="search-input"
                placeholder="Search By Title"
                v-model="searchWords"
                @keyup.enter="onPressEnter"
              />
              <button class="search-button" @click="searchNotes">Search</button>
            </div>
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

                <!-- Modal for Editing Notes -->
                <teleport to="body">
                  <div
                    v-if="isOpen && noteToEdit.id === note.id"
                    class="modal-overlay-share"
                  >
                    <div class="modal-overlay-share" @click="closeModal"></div>
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

                <!--  -->
                <div class="del-sha">
                  <button class="btn share-btn" @click="showShareModal(note)">
                    Share
                  </button>
                  <!--  -->

                  <!-- Modal for Sharing Notes -->

                  <teleport to="body">
                    <div v-if="shareOpen && noteToShare.id === note.id">
                      <div
                        class="modal-overlay-share"
                        @click="closeShareModal"
                      ></div>
                      <div class="modal-share">
                        <h2>Who are you sending it to?</h2>
                        <label for="share-email">Email:</label>
                        <input id="share-email" v-model="email" />
                        <div class="share-actions">
                          <button
                            class="btn"
                            type="submit"
                            @click="shareNote(noteToShare.id, noteToShare)"
                          >
                            Search and send
                          </button>
                          <button
                            class="btn secondary"
                            @click="closeShareModal"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </teleport>
                  <!--  -->
                  <button class="btn delete-btn" @click="deleteNote(note.id)">
                    Delete
                  </button>
                </div>
                <!--  -->
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
// Imports
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
import useNotes from "../composables/useNotes.js";
import useSharing from "../composables/useSharing.js";
// import "../assets/components_CSS/userNotes.css"; // CSS for header

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
  onPressEnter,
  closeSearchResultsModal,
  searchNotes,
  searchWords,
  searchResults,
  searchResultsModalOpen,
} = useNotes();

const { shareNote, userExists, loadNotes, getCurrentUser } = useSharing(
  notes,
  email
);

onMounted(() => {
  getCurrentUser();
});
</script>

<style scoped>
/* Modal Styles */
.modal {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  left: 50%;
  padding: 16px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
}

.modal h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* Form Styles */
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: gray;
}

.modal input,
textarea {
  display: block;
  margin-bottom: 1rem;
  flex: 1;
  word-wrap: break-word;
  max-height: 400px;
  max-width: 800px;
  min-width: 400px;
  overflow: auto;
  width: 100%;
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid #eeebeb;
  transition: border-color 0.3s ease-in-out;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Note Actions */
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
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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

/* Notes App */
.notes-app {
  margin: 50px auto;
  max-width: 1200px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

.notes-header {
  text-align: center;
  margin-bottom: 30px;
}

.notes-header h1 {
  font-size: 2.5rem;
  color: #444;
}

/* Note List */
.notes-list {
  margin-top: 40px;
}

.notes-list h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #444;
}

/* Note Details */
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

.note-title {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.bold {
  font-weight: 700;
}

.note-date {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

.note-content {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
}



/* Date */


date {
  align-items: left;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

/* Note Title */
.note-title {
  color: #666;
}

.bold {
  color: black;
}

/* Note Actions */
.note-actions {
  display: flex;
  align-items: center;
  padding-bottom: 2rem;
}

.note-actions button {
  margin-left: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.edit-btn {
  background-color: #6d9eeb;
  color: #fff;
}

.edit-btn:hover {
  background-color: #2a5993;
}

.delete-btn {
  background-color: #f1f1f1;
  color: #666;
}

.delete-btn:hover {
  background-color: #f27474;
  color: #fff;
}

.share-btn {
  background-color: #f1f1f1;
  color: #666;
}

.share-btn:hover {
  background-color: transparent;
  color: #e97451;
}

/* Empty Notes */
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

.share-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/* One column for smaller screens */
@media screen and (min-width: 700px) {
  .notes-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  /* Note Item smaller screens */
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

  .note-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transition: transform 0.6s ease-in-out;
  }

  /* Note Details smaller screens */
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

  /* Note Actions smaller screens */
  .note-actions {
    display: flex;
    align-items: center;
    margin-top: auto;
  }
}

/* Share modal */
.modal-overlay-share {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.modal-share {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  left: 50%;
  padding: 16px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  z-index: 1001;
}

.modal-share h2 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #666;
}

.modal-share input {
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 16px;
  padding: 8px;
  width: 100%;
  max-width: 100px;
  min-width: 360px;
  overflow: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.modal-share label {
  display: block;
  font-size: 16px;
  margin-bottom: 4px;
}

.share-actions {
  display: flex;
  justify-content: space-between;
}

/* Search section */
.search {
  display: flex;
  justify-content: center;
  align-items: baseline;
  justify-items: center;
  padding: 20px;
}

.search label {
  margin-right: 10px;
  font-weight: bold;
}

.search-input {
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid #eeebeb;
  transition: border-color 0.3s ease-in-out;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.search-button {
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid #eeebeb;
  transition: border-color 0.3s ease-in-out;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  background-color: #07c;
  color: #fff;
  margin-left: 10px;
}

.search-button:hover {
  background-color: #2a5993;
}

body {
  font-family: Arial, sans-serif;
}

/* Modal overlay styles */
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

/* Modal box styles */
.modal-Search {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 400px;
  /* height: 400px; */
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

/* Modal title styles */
.modal-Search h2 {
  margin-bottom: 20px;
}

/* Search actions container styles */
.Search-actions {
  display: flex;
  flex-direction: column;
}

/* Note title and content styles */
.Search-note-title,
.Search-note-content {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
}

.Search-note-title {
  font-size: 18px;
  font-weight: bold;
  background-color: #356637;
  color: white;
}

.Search-note-content {
  font-size: 16px;
  background-color: #f1f1f1;
  color: #333;
  border: 1px solid #1f0d0d;
}

/* No results modal CSS */
.no-results p {
  font-size: 16px;
  color: #888;
}

.search-results {
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
</style>

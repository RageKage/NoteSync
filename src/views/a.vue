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

// Import and call the useNotes composable
import useNotes from "../composables/useNotes.js";
import useSharing from "../composables/useSharing.js";


// import "../assets/style.css" // tailwind css




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
<style>
  /* General Styles */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    color: #333;
  }

  /* App Styles */
  .app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  /* Blob Styles */
  .blob {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background-color: #7dafff;
    clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);
  }

  /* Background Styles */
  .background {
    position: relative;
    z-index: 1;
    width: 80%;
    max-width: 900px;
    background-color: #fff;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 20px;
  }

  /* Notes App Styles */
  .notes-app {
    margin-bottom: 30px;
  }

  /* Notes List Styles */
  .notes-list {
    margin-bottom: 20px;
  }

  /* Notes Header Styles */
  .notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .notes-header h2 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .search-input {
    display: flex;
    align-items: center;
  }

  .search-input input[type="text"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    color: #333;
  }

  .search-input button.search-button {
    background-color: transparent;
    border: none;
    width: 30px;
    height: 30px;
    margin-left: 10px;
    cursor: pointer;
    background-image: url('search-icon.png');
    background-size: cover;
  }

  /* Search Results Styles */
  .search-Results {
    margin-bottom: 20px;
  }

  .search-Results h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .search-note-container {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
  }

  .search-notes-list {
    margin-bottom: 10px;
  }

  .search-notes {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  .search-note-details {
    flex: 1;
  }

  .search-note-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }

  .search-note-date {
    font-size: 14px;
    color: #666;
  }

  .search-note-actions {
    display: flex;
  }

  .search-note-actions button {
    margin-left: 5px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
  }

  /* No Results Styles */
  .no-results {
    text-align: center;
    padding: 20px;
    color: #666;
  }

  /* Search Close Button Styles */
  .search-close-Button {
    background-color: transparent;
    border: none;
    width: 30px;
    height: 30px;
    margin-left: 10px;
    cursor: pointer;
    background-image: url('close-icon.png');
    background-size: cover;
  }

  /* Notes Container Styles */
  .notes-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
  }

  /* Note Item Styles */
  .note-item {
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 15px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }

  .note-item p {
    margin-bottom: 10px;
  }

  /* Note Title Styles */
  .note-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }

  /* Note Date Styles */
  .note-date {
    font-size: 14px;
    color: #666;
  }

  /* Note Content Styles */
  .note-content {
    font-size: 14px;
    color: #333;
  }

  /* Note Actions Styles */
  .note-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .note-actions button.btn {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
  }

  /* Modal Overlay Styles */
  .modal-overlay-share {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Modal Styles */
  .modal {
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
    max-width: 400px;
    width: 80%;
    position: relative;
  }

  .modal h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .modal label {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }

  .modal input,
  .modal textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
  }

  .note-actions button.secondary {
    background-color: #ccc;
    color: #333;
  }

  /* Modal Share Styles */
  .modal-share {
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
    max-width: 400px;
    width: 80%;
    position: relative;
  }

  .modal-share h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .modal-share label {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }

  .modal-share input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
  }

  /* Empty Notes Styles */
  .empty-notes {
    text-align: center;
    padding: 50px;
    color: #666;
  }

  .empty-notes h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .empty-notes p {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .cta-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #7dafff;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .cta-button:hover {
    background-color: #66a0ff;
  }

  /* Shared Button Note Styles */
  .sharedButtonNote {
    font-size: 14px;
    color: #fff;
    background-color: #7dafff;
    padding: 8px 12px;
    border-radius: 5px;
    margin-top: 5px;
  }

  .sharedButtonNote span {
    margin-right: 5px;
  }

  .sharedButtonNote {
  font-size: 14px;
  color: #fff;
  background-color: #7dafff;
  padding: 8px 12px;
  border-radius: 5px;
  margin-top: 5px;
}

.sharedButtonNote span {
  margin-right: 5px;
}

</style>

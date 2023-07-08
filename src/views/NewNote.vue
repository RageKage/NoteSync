<template>
  <!-- Container Div -->
  <div class="container-div">
    <!-- Template to check if user is logged in -->
    <template v-if="getCurrentUser != null">
      <!-- User Information Div -->
      <div class="user-info-div">
        <!-- Header Section -->
        <header class="header-section">
          <h1>New Note</h1>
        </header>

        <!-- Note Form Section -->
        <section class="note-form-section">
          <!-- Title Div -->
          <div class="title-div">
            <label class="title-label">TITLE</label>
            <input
              type="text"
              v-model="noteTitle"
              required
              ref="titleInput"
              placeholder="My Super Duper Title Here"
              class="title-input"
            />
          </div>
          <!-- Content Div -->
          <div class="content-div">
            <label class="content-label">CONTENT</label>
            <textarea
              ref="textarea"
              v-model="noteContent"
              required
              placeholder="Once upon a time in a galaxy far, far away..."
              class="content-textarea"
            ></textarea>
          </div>
          <!-- Add Note Button Div -->
          <div class="add-note-div">
            <button type="submit" @click="addNote()" class="add-note-button">
              Add Note
            </button>
          </div>
        </section>
      </div>
    </template>
    <!-- Template to show when user is not logged in -->
    <template v-else>
      <p>Loading customer data...</p>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useNotesStore } from "../stores/newNote.js";
import Swal from "sweetalert2";
// import "../assets/components_CSS/newnote.css"

// pinia Store instance for creating new notes
const notesStore = useNotesStore();

const noteTitle = ref("");
const noteContent = ref("");
const notes = notesStore.notes;
const titleInput = ref(null);

// get the current user when the page rendered
const getCurrentUser = notesStore.getCurrentUser;
onMounted(() => {
  getCurrentUser();
});

// add a new note
const addNote = () => {
  if (noteTitle.value == "") {
    titleInput.value.focus();
    return Swal.fire({
      text: `You need to add a Title`,
      icon: "info",
    });
  } else if (noteContent.value == "") {
    return Swal.fire({
      text: `You need to add content`,
      icon: "info",
    });
  }
  notesStore.addNote(noteTitle.value, noteContent.value);
  noteTitle.value = "";
  noteContent.value = "";
  titleInput.value.focus();
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Courier New", Arial, sans-serif;
}

body {
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

/* Container Div */
.container-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.1);
  background: #fff;
  padding: 2em;
}

/* User Information Div */
.user-info-div {
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  border: 1px solid #000000;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 40px;
  margin: 0 auto;
  margin: 5rem;
  display: flex;
  flex-direction: column;
  color: #222;
  font-size: 16px;
  background: #f4f4f4;
}

/* Header Section */
.header-section {
  text-align: center;
  color: #333333;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 1em;
  margin-bottom: 1em;
}

.header-section h1 {
  color: #000000;
}

/* Note Form Section */
.note-form-section {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Title and Content Div */
.title-div,
.content-div,
.add-note-div {
  margin: 1em 0;
}

.title-label,
.content-label {
  font-size: 0.9em;
  color: #333333;
  margin-bottom: 0.5em;
}

/* Input and Textarea Styles */
.title-input,
.content-textarea {
  border: 1px solid #dddddd;
  border-radius: 4px;
  padding: 1em;
  width: 100%;
  font-size: 0.9em;
  color: #333333;
  background: #fafafa;
}

.content-textarea {
  flex: 1;
  word-wrap: break-word;
  min-height: 200px;
  max-height: 300px;
  overflow: auto;
  height: 158px;
  resize: vertical;
}

/* Add Note Button Div */
.add-note-button {
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 0.8em 1.2em;
  font-size: 0.9em;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.add-note-button:hover {
  background: #333333;
}
</style>

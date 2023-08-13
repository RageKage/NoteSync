<template>
  <!-- Container Div -->
  <div class="container-div">
    <!-- Template to check if user is logged in -->
    <template v-if="getCurrentUser != null">
      <!-- User Information Div -->
      <div class="user-info-div">
        <!-- Header Section -->
        <header class="header-section" >
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
import "@/assets/dark.scss";
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
.container-div {
  font-family: "Arial", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.user-info-div {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
    max-width: 900px;

}

.header-section h1 {
  color: #333;
  border-bottom: 1px solid #e6e8eb;
  padding-bottom: 10px;
  font-size: 1.5rem;
}

.note-form-section {
  margin-top: 30px;
}

.title-div,
.content-div {
  margin-bottom: 20px;
}

.title-label,
.content-label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #555;
}

.title-input,
.content-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.content-textarea {
  height: 200px;
  resize: vertical;
}

.add-note-button {
  background-color: #0077cc;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-note-button:hover {
  background-color: #0055aa;
}

@media (max-width: 768px) {
  .user-info-div {
    width: 90%;
    padding: 20px;
  }

  .header-section h1 {
    font-size: 24px;
  }

  .title-input,
  .content-textarea {
    font-size: 14px;
    padding: 8px;
  }

  .content-textarea {
    height: 150px;
  }

  .container-div {
    min-height: 70vh;
  }

  .add-note-button {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>

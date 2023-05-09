<template>
  <div>
    <template v-if="getCurrentUser != null">
      <div class="notes-app">
        <header class="notes-header">
          <h1>New Note</h1>
        </header>

        <section class="notes-content">
          <div class="form-group">
            <label for="note-title">Title:</label>
            <input
              type="text"
              id="note-title"
              v-model="noteTitle"
              required
              @keyup.enter="onPressEnter"
              ref="titleInput"
            />
          </div>
          <div class="form-group">
            <label for="note-content">Content:</label>
            <textarea
              ref="textarea"
              v-model="noteContent"
              @keyup.enter="onPressEnter"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <button class="btn primary" type="submit" @click="addNote()">
              Add Note
            </button>
          </div>
        </section>
      </div>
    </template>
    <template v-else>
      <p>Loading customer data...</p>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useNotesStore } from "../stores/newNote.js";
import Swal from "sweetalert2";

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

const onPressEnter = (e) => {
  // when enter is pressed take add the new note
  if (e.key === "Enter") {
    if (noteTitle.value == "") {
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
    return;
  }
};

const textarea = ref(null);

// set up a watch to adjust textarea height
watch(noteContent, () => {
  textarea.value.style.height = "auto";
  textarea.value.style.height = `${textarea.value.scrollHeight}px`;
});
</script>

<style scoped>
body {
  background-color: #f1f1f1;
  font-family: "Helvetica Neue", sans-serif;
}

/*  main notes app */
.notes-app {
  border-radius: 2rem;
  margin: 50px auto;
  max-width: 800px;
  padding: 40px;
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

/* notes form group */
.form-group {
  margin-bottom: 20px;
}
.form-group textarea {
  flex: 1;
  word-wrap: break-word;
  max-height: 300px;
  overflow: auto;
  resize: vertical;
}
label {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #666;
}
input[type="text"],
textarea {
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
button.primary {
  background-color: #6d9eeb;
  color: #fff;
}
button.primary:hover {
  background-color: #4c7ebd;
}
</style>

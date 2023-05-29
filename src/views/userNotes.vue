<template>
  <div class="app">
    <div class="blob"></div>
    <!-- Move the blob outside the background container -->
    <div class="background">
      <template v-if="notes && notes.length > 0">
        <div class="notes-app">
          <section class="notes-list">
            <header class="notes-header">
              <h2>My Notes</h2>

              <div class="search-input">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Search By Title"
                  v-model="searchWords"
                  @input="searchNotes"
                />
                <button class="search-button" @click="searchNotes"></button>
              </div>
            </header>

            <!-- Search results  -->
            <div class="search-Results" v-if="searchResultsModalOpen">
              <h2>Search Results:</h2>
              <div class="search-note-container">
                <div v-if="searchResults.length > 0" class="search-notes-list">
                  <div
                    v-for="note in searchResults"
                    :key="note.id"
                    class="search-notes"
                  >
                    <div class="search-note-details">
                      <h3 class="search-note-title">
                        Title: <b>{{ note.title }}</b>
                      </h3>
                      <p class="search-note-date">
                        <b>Date created:</b> {{ note.date }}
                      </p>
                    </div>

                    <!-- Actions for each note -->
                    <div class="search-note-actions">
                      <button
                        class="search-edit-btn"
                        @click="editNoteText(note.id)"
                      >
                        Edit
                      </button>
                      <button
                        class="search-share-btn"
                        @click="showShareModal(note)"
                      >
                        Share
                      </button>
                      <button
                        class="search-delete-btn"
                        @click="deleteNote(note.id)"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="no-results">
                  <p>No matching notes found.</p>
                </div>
                <button
                  class="search-close-Button"
                  @click="closeSearchResultsModal"
                ></button>
              </div>
            </div>
            <!--  -->
            <div class="notes-container">
              <div v-for="note in notes" :key="note.id" class="note-item">
                <p
                  @mouseover="hover = note.id"
                  @mouseleave="hover = null"
                  v-if="
                    (hover === note.id &&
                      sharedNotes[note.id] &&
                      sharedNotes[note.id].sharerEmail) ||
                    (sharedNotes[note.id] && sharedNotes[note.id].sharedStatus)
                  "
                  class="sharedButtonNote"
                >
                  <span
                    v-if="
                      hover === note.id &&
                      sharedNotes[note.id] &&
                      sharedNotes[note.id].sharerEmail
                    "
                  >
                    {{ sharedNotes[note.id].sharerEmail }}
                  </span>
                  <span v-else>
                    {{ sharedNotes[note.id].sharedStatus }}
                  </span>
                </p>

                <div class="note-details">
                  <h3 class="note-title title">
                    Title: <b class="bold">{{ note.title }} </b>
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
                      <div
                        class="modal-overlay-share"
                        @click="closeModal"
                      ></div>
                      <div class="modal">
                        <h2>Edit Note</h2>
                        <label for="edit-note-title">Title:</label>
                        <input
                          id="edit-note-title"
                          v-model="noteToEdit.title"
                        />
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
  </div>
</template>

<script setup>
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

const {
  shareNote,
  userExists,
  loadNotes,
  getCurrentUser,
  noteSharedLabel,
} = useSharing(notes, email);

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
/*  */
.app {
  position: relative;
  overflow: hidden; /* Ensure the blob remains visible even when scrolling */
}

.blob {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Move the blob behind other elements */
  pointer-events: none; /* Disable pointer events on the blob */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Crect width='1920' height='1080' fill='%23ffffff' /%3E%3Cpath d='M 0,1080 C 0,1080 0,180 0,180 C 124.46889952153109,193.52153110047846 248.93779904306217,207.04306220095694 379,214 C 509.06220095693783,220.95693779904306 644.7177033492824,221.34928229665073 780,223 C 915.2822966507176,224.65071770334927 1050.1913875598084,227.55980861244015 1166,227 C 1281.8086124401916,226.44019138755985 1378.5167464114834,222.41148325358856 1501,214 C 1623.4832535885166,205.58851674641144 1771.7416267942583,192.7942583732057 1920,180 C 1920,180 1920,1080 1920,1080 Z' fill='%23ba86d5' opacity='0.09999999999999999' /%3E%3Cpath d='M 0,1080 C 0,1080 0,360 0,360 C 118.94736842105263,394.57416267942585 237.89473684210526,429.14832535885165 355,414 C 472.10526315789474,398.85167464114835 587.3684210526316,333.98086124401914 713,323 C 838.6315789473684,312.01913875598086 974.6315789473683,354.92822966507174 1123,379 C 1271.3684210526317,403.07177033492826 1432.1052631578948,408.3062200956938 1567,402 C 1701.8947368421052,395.6937799043062 1810.9473684210525,377.8468899521531 1920,360 C 1920,360 1920,1080 1920,1080 Z' fill='%23ba86d5' opacity='0.19999999999999998' /%3E%3Cpath d='M 0,1080 C 0,1080 0,540 0,540 C 114.23923444976077,571.2918660287082 228.47846889952154,602.5837320574163 367,586 C 505.52153110047846,569.4162679425837 668.3253588516745,504.956937799043 807,507 C 945.6746411483255,509.043062200957 1060.22009569378,577.5885167464115 1166,587 C 1271.77990430622,596.4114832535885 1368.7942583732056,546.688995215311 1493,529 C 1617.2057416267944,511.31100478468903 1768.6028708133972,525.6555023923445 1920,540 C 1920,540 1920,1080 1920,1080 Z' fill='%23ba86d5' opacity='0.3' /%3E%3Cpath d='M 0,1080 C 0,1080 0,720 0,720 C 113.69377990430621,679.6076555023924 227.38755980861242,639.2153110047847 362,654 C 496.6124401913876,668.7846889952153 652.1435406698565,738.7464114832536 795,747 C 937.8564593301435,755.2535885167464 1068.0382775119617,701.7990430622009 1174,677 C 1279.9617224880383,652.2009569377991 1361.7033492822966,656.0574162679425 1482,668 C 1602.2966507177034,679.9425837320575 1761.1483253588517,699.9712918660288 1920,720 C 1920,720 1920,1080 1920,1080 Z' fill='%23ba86d5' opacity='0.39999999999999997' /%3E%3Cpath d='M 0,1080 C 0,1080 0,900 0,900 C 140.99521531100476,895.4928229665072 281.9904306220095,890.9856459330143 410,892 C 538.0095693779905,893.0143540669857 653.0334928229665,899.5502392344499 784,887 C 914.9665071770335,874.4497607655501 1061.8755980861247,842.8133971291865 1190,859 C 1318.1244019138753,875.1866028708135 1427.4641148325359,939.1961722488038 1546,954 C 1664.5358851674641,968.8038277511962 1792.267942583732,934.4019138755981 1920,900 C 1920,900 1920,1080 1920,1080 Z' fill='%23ba86d5' opacity='0.49999999999999994' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.5; /* Adjust the opacity as desired */
}

.background {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  position: relative; /* Ensure the elements inside the background container are positioned relative to it */
  z-index: 1; /* Increase the z-index to make sure the content appears above the blob */
}

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

.modal input {
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

.modal textarea {
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
  min-height: 200px;
  max-height: 300px;
  overflow: auto;
  resize: vertical;
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
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  background: #ffffff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0px 10px 20px -10px rgba(0, 0, 0, 0.75);
}

/* smaller screen notes header */
@media screen and (min-width: 700px) {
  .notes-header {
    text-align: center;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .notes-header h1 {
    font-size: 2.5rem;
    color: #444;
  }
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
  white-space: pre-wrap;

  
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
  margin: 0;
  font-size: 20px;
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
  padding: 2rem;
    border-radius: 30px;
    margin-bottom: 2rem;
    text-align: center;
    box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    color: #000;

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

.note-item {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 20px;
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

.search-input {
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  font-size: 1.2rem;
}

.search-input input {
  padding: 0.8em;
  font-size: 1em;
  border: none;
  border-radius: 50px;
  width: 250px;
  outline: none;
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.1), 0 0 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  border-radius: 15px 50px 50px 15px;
  border: none;
  padding: 10px;
  outline: none;
  flex-grow: 1;
}

.search-input input:hover {
  width: 450px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(0, 175, 175, 0.1);
}

.search-input button {
  position: absolute;
  right: 0;
  border: none;
  height: 100%;
  width: 60px;
  background-color: #914cc3;
  border-radius: 50px;
  padding: 0;
  line-height: 0;
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.1), 0 0 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.search-input button:hover {
  background-color: #c474ff;
}

.search-input button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1), 0 0 0 rgba(0, 0, 0, 0.1);
}

.search-input button:before {
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
.search-close-Button {
  background: none;
  border: none;
  position: relative;

  height: 30px;
  cursor: pointer;
  transition: transform 0.5s ease;
  width: 100%;
}

.search-close-Button:hover {
  transform: rotate(180deg);
}

.search-close-Button::before,
.search-close-Button::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 24px;
  background: #333;
}

.search-close-Button::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.search-close-Button::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* Testing */

.search-Results {
  max-height: 300px;
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

.search-Results h2 {
  margin-bottom: 10px;
  font-size: 1.3rem;
  display: flex;
  color: #444;
}

.search-note-container {
  margin-top: 20px;
}

.search-notes-list {
  margin-bottom: 20px;
}
/* 617px */

.search-notes {
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

@media screen and (max-width: 617px) {
  .search-notes {
    flex-direction: column;
  }
}

.search-note-details {
  flex-grow: 1;
}

.search-note-title {
  margin-bottom: 5px;
}

.search-note-date {
  font-size: 12px;
  color: #888;
}

.search-note-actions button {
  padding: 5px 10px;
  margin-left: 10px;
  border-radius: 3px;
  border: none;
  cursor: pointer;
}

.search-edit-btn {
  background-color: #6d9eeb;
  color: #fff;
}

.search-edit-btn:hover {
  background-color: #2a5993;
}

.search-delete-btn {
  background-color: #f1f1f1;
  color: #666;
}

.search-delete-btn:hover {
  background-color: #f27474;
  color: #fff;
}

.search-share-btn {
  background-color: #f1f1f1;
  color: #666;
}

.search-share-btn:hover {
  background-color: transparent;
  color: #e97451;
}

.no-results {
  text-align: center;
  color: #888;
  margin-bottom: 10px;
}

.btn.secondary {
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 10px;
  transition: background-color 0.2s ease-in-out;
  margin-bottom: 10px; */
  /* width: 100%; */

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-radius: 15px;
  /* padding: 10px; */
  transition: background-color 0.2s ease-in-out;
  /* margin-bottom: 10px; */
}

.btn.secondary:hover {
  background-color: #555;
}

.search-note-details {
  display: flex;
  align-items: baseline;
  padding: 1rem;
}

.search-note-title {
  margin-right: 10px;
}

.search-note-date {
  font-size: 12px;
  color: #888;
}

/* No results modal CSS */
.no-results p {
  font-size: 16px;
  color: #888;
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

/* Share noty */

.sharedButtonNote {
  background-color: #f9f9f9;

  border-radius: 5rem;
  padding: 10px;
  transition: all 0.3s ease-in-out;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.sharedButtonNote:hover {
  border-color: #777;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  cursor: pointer;
}

.sharedButtonNote span {
  color: #007bff;
  font-weight: 500;
}
</style>

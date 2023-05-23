<template>
  <div class="background">
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
              ref="titleInput"
            />
          </div>
          <div class="form-group">
            <label for="note-content">Content:</label>
            <textarea ref="textarea" v-model="noteContent" required></textarea>
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
/* General reset */

/* Main application container */
.background {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Crect width='1920' height='1080' fill='%23ffffff' /%3E%3Cpath d='M 0,1080 C 0,1080 0,180 0,180 C 124.46889952153109,193.52153110047846 248.93779904306217,207.04306220095694 379,214 C 509.06220095693783,220.95693779904306 644.7177033492824,221.34928229665073 780,223 C 915.2822966507176,224.65071770334927 1050.1913875598084,227.55980861244015 1166,227 C 1281.8086124401916,226.44019138755985 1378.5167464114834,222.41148325358856 1501,214 C 1623.4832535885166,205.58851674641144 1771.7416267942583,192.7942583732057 1920,180 C 1920,180 1920,1080 1920,1080 Z' fill='%23ba86d5' opacity='0.09999999999999999' /%3E%3Cpath d='M 0,1080 C 0,1080 0,360 0,360 C 118.94736842105263,394.57416267942585 237.89473684210526,429.14832535885165 355,414 C 472.10526315789474,398.85167464114835 587.3684210526316,333.98086124401914 713,323 C 838.6315789473684,312.01913875598086 974.6315789473683,354.92822966507174 1123,379 C 1271.3684210526317,403.07177033492826 1432.1052631578948,408.3062200956938 1567,402 C 1701.8947368421052,395.6937799043062 1810.9473684210525,377.8468899521531 1920,360 C 1920,360 1920,1080 1920,1080 Z' fill='%23ba86d5' opacity='0.19999999999999998' /%3E%3Cpath d='M 0,1080 C 0,1080 0,540 0,540 C 114.23923444976077,571.2918660287082 228.47846889952154,602.5837320574163 367,586 C 505.52153110047846,569.4162679425837 668.3253588516745,504.956937799043 807,507 C 945.6746411483255,509.043062200957 1060.22009569378,577.5885167464115 1166,587 C 1271.77990430622,596.4114832535885 1368.7942583732056,546.688995215311 1493,529 C 1617.2057416267944,511.31100478468903 1768.6028708133972,525.6555023923445 1920,540 C 1920,540 1920,1080 1920,1080 Z' fill='%23ba86d5' opacity='0.3' /%3E%3Cpath d='M 0,1080 C 0,1080 0,720 0,720 C 113.69377990430621,679.6076555023924 227.38755980861242,639.2153110047847 362,654 C 496.6124401913876,668.7846889952153 652.1435406698565,738.7464114832536 795,747 C 937.8564593301435,755.2535885167464 1068.0382775119617,701.7990430622009 1174,677 C 1279.9617224880383,652.2009569377991 1361.7033492822966,656.0574162679425 1482,668 C 1602.2966507177034,679.9425837320575 1761.1483253588517,699.9712918660288 1920,720 C 1920,720 1920,1080 1920,1080 Z' fill='%23ba86d5' opacity='0.39999999999999997' /%3E%3Cpath d='M 0,1080 C 0,1080 0,900 0,900 C 140.99521531100476,895.4928229665072 281.9904306220095,890.9856459330143 410,892 C 538.0095693779905,893.0143540669857 653.0334928229665,899.5502392344499 784,887 C 914.9665071770335,874.4497607655501 1061.8755980861247,842.8133971291865 1190,859 C 1318.1244019138753,875.1866028708135 1427.4641148325359,939.1961722488038 1546,954 C 1664.5358851674641,968.8038277511962 1792.267942583732,934.4019138755981 1920,900 C 1920,900 1920,1080 1920,1080 Z' fill='%23ba86d5' opacity='0.49999999999999994' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: cover;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* z-index: -1; */
}

.notes-app {
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin: 100px auto;
  max-width: 800px;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

/* Header styles */
.notes-header h1 {
  color: #333;
  margin-bottom: 1em;
}

/* Note input styles */
.notes-content .form-group {
  margin-bottom: 1em;
}

.form-group textarea {
  flex: 1;
  word-wrap: break-word;
  min-height: 200px;
  max-height: 300px;
  overflow: auto;
  height: 158px;
  resize: vertical;
}

.notes-content label {
  font-size: 0.9em;
  color: #555;
}

.notes-content input,
.notes-content textarea {
  width: 100%;
  padding: 0.8em;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  color: #333;
}

.notes-content textarea {
  min-height: 150px;
  resize: vertical;
}

/* Button styles */
.btn.primary {
  display: inline-block;
  padding: 0.8em 1.5em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn.primary:hover {
  background-color: #0056b3;
}
</style>

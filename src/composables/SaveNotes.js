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


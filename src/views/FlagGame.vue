<template>
  <div>
    <div class="container">
      <h1 v-if="showFlags">{{ flagName }}</h1>
      <h1 v-if="!showFlags">Welcome to the Flag Game!</h1>

      <!-- Game Info  -->
      <div v-if="!showFlags" class="game-info" id="gameInstructions">
        <p class="how-to-play-title">How to Play:</p>
        <ul class="game-rules">
          <li class="game-rule">Guess the country flag by their name.</li>
          <li class="game-rule">A wrong guess costs a heart</li>
          <li class="game-rule">
            A correct guess adds 5 seconds to the timer and can restore a heart (up to 3 max).
          </li>
        </ul>
      </div>
      <!-- End of Game Info -->
      <div v-if="showTimer && showFlags" class="timer">{{ timerText }}</div>
      <div class="score-container">
        <p v-if="showScore">
          <span class="heart" v-for="(heart, index) in hearts" :key="index">
            <i
              :class="heart.active ? 'fas fa-heart' : 'fas fa-heart-broken'"
            ></i>
          </span>
        </p>
      </div>

      <div v-if="showFlags" class="flags">
        <div v-for="(flag, index) in shuffledFlags" :key="index" class="flag">
          <img :src="flag.image" @click="evaluateGuess(index)" />
        </div>
      </div>
      <div class="restart">
        <button v-if="showStartButton" @click="startGame">Start Game</button>
      </div>
      <div v-if="gameOver" id="gameOverScreen">
        <h2>Game Over</h2>
        <p id="scoreBoard">
          You got <span id="correctGuesses">{{ score }} </span> countries
          correct!
        </p>
        <div class="game-over-options">
          <button @click="restartGame">Play Again</button>
        <button @click="refreshPage" class="game-link">Game Rules</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { flagImages } from "../stores/flagImg.js";

const score = ref(0);
const wrongGuesses = ref(0);
const remainingTime = ref(60);
let timerInterval;

const showTimer = computed(() => remainingTime.value > 0);
const showScore = ref(false);
const showStartButton = ref(true);
const gameOver = ref(false);
const flagName = ref("Flag Game");
const timerText = computed(() => `Time: ${remainingTime.value} seconds`);
const correctAnswer = ref(null);
const showFlags = ref(false);

const hearts = computed(() => [
  { active: wrongGuesses.value < 1 },
  { active: wrongGuesses.value < 2 },
  { active: wrongGuesses.value < 3 },
]);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const shuffledFlags = ref(shuffle(flagImages).slice(0, 3));

function startGame() {
  showStartButton.value = false;
  showScore.value = true;
  showFlags.value = true;

  score.value = 0;
  wrongGuesses.value = 0;
  remainingTime.value = 60;

  startTimer();
  startRound();
}

function startTimer() {
  timerInterval = setInterval(() => {
    remainingTime.value--;
    if (remainingTime.value === 0) {
      endGame();
    }
  }, 1000);
}

function restartGame() {
  gameOver.value = false;
  score.value = 0;
  wrongGuesses.value = 0;
  remainingTime.value = 60;
  clearInterval(timerInterval);
  startTimer();
  startRound();
}

function evaluateGuess(guess) {
  console.log(wrongGuesses.value);
  if (guess === correctAnswer.value) {
    score.value++;
    remainingTime.value += 5;
    if (wrongGuesses.value > 0) {
      wrongGuesses.value--;
    }
  } else {
    wrongGuesses.value++;
  }

  if (wrongGuesses.value === 3 || remainingTime.value === 0) {
    endGame();
    return;
  }

  startRound();
}

function startRound() {
  if (wrongGuesses.value === 3) {
    alert("Game over!");
    return;
  }

  // Shuffle all flags and pick the first three
  shuffledFlags.value = shuffle(flagImages).slice(0, 3);
  correctAnswer.value = Math.floor(Math.random() * 3);
  flagName.value = shuffledFlags.value[correctAnswer.value].name;
}

function endGame() {
  clearInterval(timerInterval);
  gameOver.value = true;
}


function refreshPage() {
  window.location.reload();
}
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css";

.heart {
  color: #e74c3c;
  font-size: 24px;
  margin-left: 5px;
  margin-left: 10px;
  display: inline-block;
  transform: scale(-1, 1);
  transition: transform 1s ease;
  cursor: pointer;
  padding: 1rem;
}

.heart.inactive {
  color: #bdc3c7;
}

.heart:hover {
  transform: scale(1.1);
}

.score-container {
  padding: 10px 20px;
  margin: 20px auto;
}

#score {
  color: #eee;
  font-size: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  display: none;
}

body {
  background-color: #f0f3f4;
  font-family: "Arial", sans-serif;
  margin: 0;
}

.container {
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  background-color: #f0f2f5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

h1 {
  color: #2c3e50;
  text-align: center;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px #0000001a;
  margin-bottom: 1rem;
  width: 100%;
  font-size: 2rem;
  margin-top: 2.5rem;
  /* background-color: #f0f2f5; */
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.timer {
  text-align: center;
  font-size: 24px;
  color: #e74c3c;
}

.flags {
  display: flex;
  justify-content: space-around;
}

@media screen and (min-width: 700px) {
  .flags {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .heart {
    font-size: 2.5rem;
  }

  .heart:hover {
    transform: scale(1.15);
  }
}

@media screen and (max-width: 700px) {
  .score-container {
    padding: 5px 10px;
    margin: 5px auto;
  }

  .timer {
    text-align: center;
    font-size: 15px;
    color: #e74c3c;
  }

  .heart {
    font-size: 20px;
  }

  .heart:hover {
    transform: scale(1.1);
  }
}

.flags div {
  width: 30%;
  margin: 10px;
}

.flags img {
  width: 100%;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.flags img:hover {
  transform: scale(1.1);
}

.restart {
  text-align: center;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
}
#gameOverScreen {
  text-align: center;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fffffff0;
  z-index: 1000;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
}

button {
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;
  margin: 0.5rem;
}

button:hover {
  background-color: #2980b9;
}

#gameOverScreen h2 {
  color: #e74c3c;
  margin: 1rem;
  font-size: 2rem;
}

#gameOverScreen p {
  font-size: 20px;
  margin: 1rem;
}

#correctGuesses {
  font-weight: bold;
  color: #2ecc71;
}

#scoreboard {
  margin: 1rem;
}

/* Game Info Div Styling */
.game-info {
  color: #2c3e50;
  background-color: #ffffff;
  box-shadow: 0 2px 4px #0000001a;
  margin-bottom: 1rem;
  width: 100%;
  font-size: 2rem;
  margin-top: 2.5rem;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.info-title,
.how-to-play-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 15px;
}

.game-rules {
  margin-left: 20px;
}

.game-rule {
  margin-bottom: 8px;
  font-size: 16px;
  color: #7f8c8d;
}

.game-rule:hover {
  color: #2c3e50;
  cursor: pointer;
}

.game-over-options {
  display: flex;
    justify-content: center;

}
</style>

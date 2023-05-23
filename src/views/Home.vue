<template>
  <div class="background">
    <div class="container">
      <header>
        <img
          src="../assets/pngfind.com-indiana-outline-png-2131193.png"
          alt="NoteSync"
        />
        <h1>Welcome to NoteSync!</h1>
        <p>
          A place to capture your thoughts and ideas in one place that is easily
          accessible.
        </p>
      </header>
      <div class="content">
        <div class="left">
          <h2>Key Features</h2>
          <p>
            Note-taking web app, designed for seamless and secure organization
            of your personal notes!
          </p>
          <ul>
            <li>🚀 Key features:</li>
            <li>✍️ Create, read, update, and delete notes with ease</li>
            <li>
              🔄 Real-time data synchronization with Firebase Realtime Database
            </li>
            <li>🔒 Secure user sign-up and sign-in using Google OAuth</li>
            <li>🌐 Responsive design for a great experience on any device</li>
            <li>🔗 Easily share your notes with fellow users</li>
          </ul>
          <p>
            Developed with Vue.js, Firebase, and Vite, the app also leverages
            GitHub Actions for continuous integration and deployment to Firebase
            Hosting, ensuring smooth updates. As this is the beta testing phase,
            I'd love to hear your feedback on the app's functionality and any
            areas for improvement.
          </p>
          <p>
            Created by Niman Ahmed. Contact me at
            <a href="mailto:notesyncservice@gmail.com" class="email"
              >notesyncservice@gmail.com</a
            >
            with any questions or feedback!
          </p>
        </div>
        <div class="right">
          <div class="signed-in" v-if="!signedIn">
            <p>
              Get started and start capturing your thoughts, ideas, and
              inspirations!
            </p>
            <router-link to="/register" class="sign-up">
              Sign up Now!
            </router-link>
          </div>
          <div class="signed-in" v-if="signedIn">
            <p>
              Stay tuned! I will be adding more features like a reminder and
              sharing with friends.
            </p>
            <router-link to="/new-note" class="sign-up">
              Start Writing!
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { getAuth, signOut as signOutFirebase } from "firebase/auth";
import router from "../router/router";
import { useRoute } from "vue-router";
// import "../assets/components_CSS/home.css";

const auth = getAuth();
const signedIn = ref(false);

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      signedIn.value = true; // Set signedIn to true if the user is signed in
    } else {
      signedIn.value = false; // Set signedIn to false if the user is signed out
    }
  });
});
</script>

<style scoped>
.background {
  background-image: url("data:image/svg+xml;charset=utf-8,<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' width='100%' id='blobSvg' filter='blur(2px)' style='opacity: 1;' transform='rotate(13)'><defs><linearGradient id='gradient' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' style='stop-color: rgb(255, 255, 255);'></stop><stop offset='100%' style='stop-color: rgb(235, 138, 255);'></stop></linearGradient></defs><path id='blob' fill='url(%23gradient)' style='opacity: 0.9;'><animate attributeName='d' dur='13200ms' repeatCount='indefinite' values='M409,303.5Q416,357,378,402Q340,447,282,439Q224,431,187,398.5Q150,366,105.5,335.5Q61,305,45,245Q29,185,59,124.5Q89,64,152.5,40Q216,16,265,63.5Q314,111,383,115.5Q452,120,427,185Q402,250,409,303.5Z;M440.79254,295.90011Q393.21514,341.80021,357.53347,375.20746Q321.85181,408.61471,271.82218,427.01866Q221.79254,445.4226,171.55544,422.09659Q121.31834,398.77057,68.79254,358.84083Q16.26674,318.91109,38.15202,256.60373Q60.03731,194.29637,79.65586,134.88912Q99.27441,75.48187,157.19648,42.12622Q215.11855,8.77057,268.67782,50.11855Q322.2371,91.46653,362.16684,121.87761Q402.09659,152.2887,445.23326,201.14435Q488.36994,250,440.79254,295.90011Z;M430.80624,308.72934Q432.1339,367.45868,372.72647,377.66948Q313.31905,387.88027,263.72647,442.80911Q214.1339,497.73795,154.61821,463.08837Q95.10253,428.43879,60.15953,372.16526Q25.21653,315.89174,60.3661,260.16239Q95.51568,204.43305,120.04418,166.21939Q144.57268,128.00574,181.94874,82.19376Q219.32479,36.38179,273.74216,57.19376Q328.15953,78.00574,384.05413,102.85329Q439.94874,127.70084,434.71366,188.85042Q429.47858,250,430.80624,308.72934Z;M456.0768,303.76136Q418.13543,357.52271,379.98225,404.29316Q341.82907,451.0636,284.01817,433.65772Q226.20727,416.25185,163.99091,418.54046Q101.77456,420.82907,62.72047,368.86953Q23.66638,316.90999,61.99091,261.65772Q100.31545,206.40545,118.97771,163.62635Q137.63998,120.84725,179.51817,86.26136Q221.39637,51.67547,267.19818,81.83773Q313,112,367.68455,125.86045Q422.36911,139.7209,458.19364,194.86045Q494.01817,250,456.0768,303.76136Z;M394.89432,291.86359Q379.96349,333.72718,354.5999,379.04899Q329.23631,424.37079,274.96542,439.22911Q220.69452,454.08742,185.59462,409.0927Q150.49472,364.09798,125.7075,328.96349Q100.92028,293.82901,59.42363,237.80355Q17.92698,181.77809,66.30163,137.5999Q114.67627,93.42171,168.36359,75.4145Q222.05091,57.4073,282.76369,51.5999Q343.47647,45.7925,374.93276,97.57444Q406.38905,149.35639,408.1071,199.67819Q409.82516,250,394.89432,291.86359Z;M409,303.5Q416,357,378,402Q340,447,282,439Q224,431,187,398.5Q150,366,105.5,335.5Q61,305,45,245Q29,185,59,124.5Q89,64,152.5,40Q216,16,265,63.5Q314,111,383,115.5Q452,120,427,185Q402,250,409,303.5Z'></animate></path><path id='blob' fill='url(%23gradient)' style='opacity: 0.9;'><animate attributeName='d' dur='13200ms' repeatCount='indefinite' values='M440.89145,308.17188Q431.49014,366.34375,386.51892,408.54441Q341.5477,450.74507,280.86143,454.67188Q220.17516,458.59868,161.4046,439.6065Q102.63404,420.61431,74.24712,365.23068Q45.86019,309.84704,51.25164,251.37253Q56.64309,192.89803,94.98232,154.25946Q133.32155,115.62089,180.13528,103.21957Q226.94901,90.81826,286.5366,64.96012Q346.12418,39.10197,382.33594,90.33923Q418.5477,141.57648,434.42023,195.78824Q450.29277,250,440.89145,308.17188Z;M409,303.5Q416,357,378,402Q340,447,282,439Q224,431,187,398.5Q150,366,105.5,335.5Q61,305,45,245Q29,185,59,124.5Q89,64,152.5,40Q216,16,265,63.5Q314,111,383,115.5Q452,120,427,185Q402,250,409,303.5Z;M440.79254,295.90011Q393.21514,341.80021,357.53347,375.20746Q321.85181,408.61471,271.82218,427.01866Q221.79254,445.4226,171.55544,422.09659Q121.31834,398.77057,68.79254,358.84083Q16.26674,318.91109,38.15202,256.60373Q60.03731,194.29637,79.65586,134.88912Q99.27441,75.48187,157.19648,42.12622Q215.11855,8.77057,268.67782,50.11855Q322.2371,91.46653,362.16684,121.87761Q402.09659,152.2887,445.23326,201.14435Q488.36994,250,440.79254,295.90011Z;M415.01911,310.8863Q439.5452,371.7726,388.0904,405.2945Q336.6356,438.8164,280.7726,433.452Q224.9096,428.08761,185.95759,398.74511Q147.00559,369.40261,129.05219,330.15471Q111.09878,290.9068,102.89189,247.863Q94.68499,204.8192,97.4315,140.3164Q100.17801,75.81361,160.4068,60.51771Q220.6356,45.22181,275.226,60.1356Q329.8164,75.04939,372.9534,109.3658Q416.0904,143.6822,403.29171,196.8411Q390.49301,250,415.01911,310.8863Z;M437.20545,311.82292Q441.89352,373.64584,380.77431,387.66608Q319.65509,401.68633,271.82754,416.34317Q224,431,184.22569,401.27431Q144.45139,371.54861,81.45601,344.74769Q18.46064,317.94676,58.87153,261.64584Q99.28242,205.34491,102.46413,144.38253Q105.64584,83.42014,164.05961,69.5926Q222.47338,55.76506,274.24769,69.97338Q326.02199,84.18171,376.989,109.95139Q427.95601,135.72107,430.23669,192.86053Q432.51737,250,437.20545,311.82292Z'></animate></path></svg>");
  background-size: cover;
  background-position: center;

  background-repeat: no-repeat;
  background-size: cover;

  /* position: fixed; */

  width: 100%;
  height: 100%;
}

/* Reset styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Body styles */
body {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Container styles */
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

/* Header styles */
header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 3rem;
    /* background-color: #fff; */
    color: #1c1b1b;
    padding: 2rem;
    border-radius: 1rem;
}

header img {
    max-width: 200px;
    margin-bottom: 1rem;
    display: flex;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

header p {
    font-size: 1.25rem;
    margin-bottom: 1rem;
}

/* Content styles */
.content {
    gap: 2rem;
    flex-direction: column;
}

/* Left column styles */
.left {
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    text-align: center;
    box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    color: #000;
}

.left h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

.left p {
    margin-bottom: 1rem;
}

.left ul {
    list-style-type: none;
    padding-left: 1.5rem;
}

.left li {
    margin-bottom: 0.5rem;
}

/* Right column styles */
.right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.right p {
    margin-bottom: 1rem;
}

/* Router link styles */
router-link {
    display: inline-block;
    background-color: #3f51b5;
    color: #ffffff;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
}

router-link:hover {
    background-color: #5c6bc0;
    cursor: pointer;
}

/* Email link styles */
.email {
    color: #4caf50;
    text-decoration: none;
    font-weight: bold;
}

/* Sign up button styles */
.sign-up {
    margin: 1rem;
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
    color: #fff;
    font-weight: 500;
    text-decoration: none;
}

.sign-up:hover {
    background-color: #388e3c;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* Signed in section styles */
.signed-in {
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    text-align: center;
    box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    color: #000;

    
}

.signed-in p {
    font-size: 1rem;
    margin-bottom: 1rem;
}

</style>

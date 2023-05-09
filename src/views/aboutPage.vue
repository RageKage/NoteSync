<template>
  <div class="container">
    <header>
      <img
        src="../assets/notebooknd-shop.jpeg"
        alt="NoteSync"
        style="max-width: 200px"
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
          Note-taking web app, designed for seamless and secure organization of
          your personal notes!
        </p>
        <ul>
          <li>🚀 Key features:</li>
          <li>✍️ Create, read, update, and delete notes with ease</li>
          <li>
            🔄 Real-time data synchronization with Firebase Realtime Database
          </li>
          <li>🔒 Secure user sign-up and sign-in using Google OAuth</li>
          <li>🌐 Responsive design for a great experience on any device</li>
        </ul>
        <p>
          Note-taking web app, designed for seamless and secure organization of
          your personal notes! Developed with Vue.js, Firebase, and Vite, the
          app also leverages GitHub Actions for continuous integration and
          deployment to Firebase Hosting, ensuring smooth updates. As this is
          the beta testing phase, I'd love to hear your feedback on the app's
          functionality and any areas for improvement.
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
        <p>
          Get started and start capturing your thoughts, ideas, and
          inspirations!
        </p>
        <router-link v-if="!signedIn" to="/register" class="sign-up">
          Sign up Now!
        </router-link>
        <router-link v-if="signedIn" to="/new-note">
          Start Writing!
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* General CSS reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #000000;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 3rem;
  background-color: #fff;
  color: #1c1b1b;
  padding: 2rem;
  border-radius: 1rem;

  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.1);
}

header img {
  max-width: 200px;
  margin-bottom: 1rem;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

header p {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.left,
.right {
  flex: 1;
}

.left {
  padding: 2rem;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;

  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.1);
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
.email {
  color: #4caf50;
  text-decoration: none;
  font-weight: bold;
}

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

@media screen and (max-width: 568px) {
  .content {
    flex-direction: column;
  }

  .left,
  .right {
    flex: none;
    max-width: 100%;
  }
}
</style>

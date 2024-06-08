"use strict";

import { auth } from "./setupFirebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, collection, setDoc } from "firebase/firestore";
import { db } from "./setupFirebase";

const getStartBtn = document.querySelector("#get-start");
const registrationForm = document.querySelector(".auth__form_register");
const nameInput = document.querySelector(".auth__name");
const emailInput = document.querySelector(".auth__email");
const passwordInput = document.querySelector(".auth__password");
const confirmPasswordInput = document.querySelector(".auth__confirm-password");
const authOptions = document.querySelector(".auth__options");
const alreadyHaveParagraph = document.querySelector(".auth__already-account");
const alreadyHaveButton = document.querySelector(".auth__signin");

const createAccount = async (event) => {
  event.preventDefault();

  const registrationName = nameInput.value;
  const registrationEmail = emailInput.value;
  const registrationPassword = passwordInput.value;

  try {
    if (confirmPasswordInput.value === registrationPassword) {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registrationEmail,
        registrationPassword
      );

      const user = userCredential.user;
      await updateProfile(user, { displayName: registrationName });

      // сохранить user в firestore

      const timestamp = Date.now().toString();

      console.log(user);

      await setDoc(doc(db, "users", user.uid), {
        displayName: registrationName,
        dateOfRegistration: timestamp,
        email: user.email,
      });

      // Add first task

      const taskRef = doc(db, "users", user.uid, "tasks", timestamp);

      await setDoc(taskRef, {
        text: "Create your first task",
        date: new Date().getTime(),
        isCompleted: false,
        id: timestamp,
      });

      // сохранить user id в куки

      document.cookie = `userId=${user.uid}`;

      window.location.href = "/app";
    }
  } catch (error) {
    console.error(
      "Sign Up error:",
      error.message,
      " on line: ",
      error.lineNumber
    );
  }
};

const signIn = async (event) => {
  event.preventDefault();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
    const user = userCredential.user;
    document.cookie = `userId=${user.uid}`;
    window.location.href = "/app";
  } catch (error) {
    console.error("Sign In error:", error.message);
  }
};

getStartBtn.addEventListener("click", function getStart() {
  const welcomeTextBox = document.querySelector(".welcome__text");
  const registrationTextBox = document.querySelector(".registration__text");
  const signInTextBox = document.querySelector(".signin__text");

  // --------------------------------------------
  //           Authorization visual logic
  // --------------------------------------------

  // --------------------------------------------
  //           Todo forgot password
  // --------------------------------------------

  welcomeTextBox.style.display = "none";
  registrationTextBox.style.display = "block";
  registrationForm.style.display = "block";
  authOptions.style.display = "flex";

  alreadyHaveButton.addEventListener("click", () => {
    alreadyHaveButton.dataset.value === "register"
      ? (alreadyHaveButton.dataset.value = "signin")
      : (alreadyHaveButton.dataset.value = "register");

    if (alreadyHaveButton.dataset.value === "register") {
      nameInput.style.display = "block";
      confirmPasswordInput.style.display = "block";
      signInTextBox.style.display = "none";
      registrationTextBox.style.display = "block";
      alreadyHaveParagraph.textContent = "Already have an account?";
      alreadyHaveButton.textContent = "Sign In";

      getStartBtn.innerHTML = "Register";
      getStartBtn.removeEventListener("click", signIn);
      getStartBtn.addEventListener("click", createAccount);
    } else {
      nameInput.style.display = "none";
      confirmPasswordInput.style.display = "none";
      signInTextBox.style.display = "block";
      registrationTextBox.style.display = "none";
      alreadyHaveParagraph.textContent = "Don't have an account yet?";
      alreadyHaveButton.textContent = "Register";

      getStartBtn.innerHTML = "Sign In";
      getStartBtn.removeEventListener("click", createAccount);
      getStartBtn.addEventListener("click", signIn);
    }
  });

  // It becomes register button
  getStartBtn.innerHTML = "Register";
  getStartBtn.removeEventListener("click", getStart);
  getStartBtn.addEventListener("click", createAccount);
});

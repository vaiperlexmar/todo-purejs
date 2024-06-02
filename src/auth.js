"use strict";

const getStartBtn = document.querySelector("#get-start");

getStartBtn.addEventListener("click", function getStart() {
  const welcomeTextBox = document.querySelector(".welcome__text");
  const registrationTextBox = document.querySelector(".registration__text");
  welcomeTextBox.style.display = "none";
  registrationTextBox.style.display = "block";

  getStartBtn.innerHTML = "Register";
  getStartBtn.removeEventListener("click", getStart);
});

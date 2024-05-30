"use strict";

import { doc, deleteDoc } from "firebase/firestore/lite";
import { db } from "./db.js";

const makeComplete = async function () {
  await deleteDoc(doc(db, "tasks", this.parentElement.dataset.id));

  this.parentElement.remove();
};

export default function createTask(text, timestamp, isCompleted, id) {
  const listEl = document.createElement("li");
  listEl.classList.add("task");
  listEl.dataset.id = id;
  listEl.dataset.timestamp = timestamp;

  const checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.name = "isCompleted";
  checkboxEl.checked = isCompleted;
  checkboxEl.classList.add("task__checkbox");

  checkboxEl.addEventListener("click", makeComplete);

  const textEl = document.createElement("p");
  textEl.textContent = text;
  textEl.classList.add("task__content");

  listEl.appendChild(checkboxEl);
  listEl.appendChild(textEl);

  return listEl;
}

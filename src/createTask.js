"use strict";

import { doc, updateDoc } from "firebase/firestore/lite";
import { db } from "./db.js";
import distributeTask from "./distributeTask.js";

const makeComplete = async function () {
  const taskEl = this.parentElement;
  const taskRef = doc(db, "tasks", this.parentElement.dataset.id);

  if (this.checked) {
    await updateDoc(taskRef, { isCompleted: true });
    taskEl.dataset.isCompleted = true;

    taskEl.remove();
    distributeTask(taskEl, taskEl.dataset.timestamp);
    taskEl.classList.add("task_completed");
  } else {
    await updateDoc(taskRef, { isCompleted: false });
    taskEl.dataset.isCompleted = false;

    taskEl.remove();
    distributeTask(taskEl, taskEl.dataset.timestamp);
    taskEl.classList.remove("task_completed");
  }
};

export default function createTask(text, timestamp, isCompleted, id) {
  const listEl = document.createElement("li");
  listEl.classList.add("task");
  listEl.dataset.id = id;
  listEl.dataset.timestamp = timestamp;
  listEl.dataset.isCompleted = isCompleted;

  isCompleted
    ? listEl.classList.add("task_completed")
    : listEl.classList.remove("task_completed");

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

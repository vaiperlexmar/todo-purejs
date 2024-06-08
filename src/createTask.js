"use strict";

import { doc, updateDoc, deleteDoc } from "firebase/firestore/lite";
import { db } from "./setupFirebase.js";
import distributeTask from "./distributeTask.js";

async function deleteTask() {
  const task = this.parentElement.parentElement;
  try {
    await deleteDoc(doc(db, "tasks", task.dataset.id));
  } catch (err) {
    console.error("Error with deleting task:", err.message);
  }
  task.remove();
}

const makeComplete = async function () {
  const taskEl = this.parentElement;
  const taskRef = doc(db, "tasks", this.parentElement.dataset.id);

  try {
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
  } catch (err) {
    console.log("Error with making task completed:", err.message);
  }
};

export default function createTask(text, timestamp, isCompleted, id) {
  // =====================================
  //      Creating base of task
  // =====================================

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

  // =====================================
  //      Option block logic
  // =====================================

  const optionsBlock = document.createElement("div");
  const deleteBtn = document.createElement("button");
  const editBtn = document.createElement("button");

  optionsBlock.classList.add("task__option-block");
  deleteBtn.classList.add("btn", "task__option-btn", "task__delete-btn");
  editBtn.classList.add("btn", "task__option-btn", "task__edit-btn");

  // -------------------------------------
  //      Delete button logic
  // -------------------------------------

  deleteBtn.addEventListener("click", async function () {
    deleteBtn.classList.remove("task__delete-btn", "rev-rotate-sure-yes");
    deleteBtn.classList.add("rotate-sure-yes");

    editBtn.classList.remove("task__edit-btn", "rev-rotate-sure-no");
    editBtn.classList.add("rotate-sure-no");

    // REMOVE EVENTLISTENER OF EDIT BUTTON

    // Cancel of deleting
    editBtn.addEventListener("click", () => {
      deleteBtn.classList.remove("rotate-sure-yes");
      deleteBtn.classList.add("rev-rotate-sure-yes");
      setTimeout(() => {
        deleteBtn.classList.add("task__delete-btn");
      }, 500);
      deleteBtn.removeEventListener("click", deleteTask);

      // Add its event listener
      editBtn.classList.remove("rotate-sure-no");
      editBtn.classList.add("rev-rotate-sure-no");
      setTimeout(() => {
        editBtn.classList.add("task__edit-btn");
      }, 500);
    });

    // Approve of deleting
    deleteBtn.addEventListener("click", deleteTask);
  });

  optionsBlock.appendChild(deleteBtn);
  optionsBlock.appendChild(editBtn);

  // =====================================
  //      Add elements to task
  // =====================================

  listEl.appendChild(checkboxEl);
  listEl.appendChild(textEl);
  listEl.appendChild(optionsBlock);

  return listEl;
}

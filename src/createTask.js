"use strict";

import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "./setupFirebase.js";
import distributeTask from "./distributeTask.js";

const userId =
  auth.currentUser !== null ? auth.currentUser.uid : document.cookie.slice(7);

async function deleteTask() {
  const task = this.parentElement.parentElement;
  try {
    await deleteDoc(doc(db, "users", userId, "tasks", task.dataset.id));
  } catch (err) {
    console.error("Error with deleting task:", err.message);
  }
  task.remove();
}

const makeComplete = async function () {
  const taskEl = this.parentElement;
  const taskRef = doc(
    db,
    "users",
    userId,
    "tasks",
    this.parentElement.dataset.id
  );

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

async function editTask(id, newText) {
  try {
    const taskRef = doc(db, "users", userId, "tasks", id);
    await updateDoc(taskRef, { text: newText });
  } catch (err) {
    console.error(err.message);
  }
}

export default function createTask(text, timestamp, isCompleted, id) {
  // =====================================
  //      Creating base of task
  // =====================================

  const taskEl = document.createElement("li");
  taskEl.classList.add("task");
  taskEl.dataset.id = id;
  taskEl.dataset.timestamp = timestamp;
  taskEl.dataset.isCompleted = isCompleted;

  isCompleted
    ? taskEl.classList.add("task_completed")
    : taskEl.classList.remove("task_completed");

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
  const taskEditInput = document.createElement("input");
  taskEditInput.classList.add("task__input");
  taskEditInput.value = text;
  taskEditInput.setAttribute("onfocus", "this.value = this.value;");

  optionsBlock.classList.add("task__option-block");
  deleteBtn.classList.add("btn", "task__option-btn", "task__delete-btn");
  editBtn.classList.add("btn", "task__option-btn", "task__edit-btn");

  function cancel() {
    deleteBtn.classList.remove("rotate-sure-yes");
    deleteBtn.classList.add("rev-rotate-sure-yes");
    setTimeout(() => {
      deleteBtn.classList.add("task__delete-btn");
    }, 500);
    deleteBtn.removeEventListener("click", deleteTask);
    deleteBtn.removeEventListener("click", editTask);

    // Add its event listener
    editBtn.classList.remove("rotate-sure-no");
    editBtn.classList.add("rev-rotate-sure-no");
    setTimeout(() => {
      editBtn.classList.add("task__edit-btn");
    }, 500);
    textEl.style.display = "block";
    taskEditInput.style.display = "none";
    editBtn.removeEventListener("click", cancel);
  }

  // -------------------------------------
  //      Delete button logic
  // -------------------------------------

  deleteBtn.addEventListener("click", function () {
    deleteBtn.classList.remove("task__delete-btn", "rev-rotate-sure-yes");
    deleteBtn.classList.add("rotate-sure-yes");

    editBtn.classList.remove("task__edit-btn", "rev-rotate-sure-no");
    editBtn.classList.add("rotate-sure-no");

    // !!!REMOVE EVENTLISTENER OF EDIT BUTTON!!!

    // Cancel of deleting
    editBtn.addEventListener("click", cancel);

    // Approve of deleting
    deleteBtn.addEventListener("click", deleteTask);
  });

  // -------------------------------------
  //      Edit button logic
  // -------------------------------------

  editBtn.addEventListener("click", function () {
    // reset of buttons
    deleteBtn.classList.remove("task__delete-btn", "rev-rotate-sure-yes");
    deleteBtn.classList.add("rotate-sure-yes");

    editBtn.classList.remove("task__edit-btn", "rev-rotate-sure-no");
    editBtn.classList.add("rotate-sure-no");

    // Rebuilding of task for editing
    taskEditInput.style.display = "block";
    taskEl.insertBefore(taskEditInput, optionsBlock);
    textEl.style.display = "none";
    taskEditInput.focus({ focusVisible: true });

    // Cancel of editing
    editBtn.addEventListener("click", cancel);

    // Approve of editing
    deleteBtn.addEventListener("click", function () {
      try {
        editTask(taskEl.dataset.id, taskEditInput.value);
        textEl.textContent = taskEditInput.value;
      } finally {
        cancel();
      }
    });
  });

  optionsBlock.appendChild(deleteBtn);
  optionsBlock.appendChild(editBtn);

  // =====================================
  //      Add elements to task
  // =====================================

  taskEl.appendChild(checkboxEl);
  taskEl.appendChild(textEl);
  taskEl.appendChild(optionsBlock);

  return taskEl;
}

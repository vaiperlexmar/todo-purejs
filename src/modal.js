"use strict";

import { db, auth } from "./setupFirebase";
import { doc, setDoc } from "firebase/firestore";
import flatpickr from "flatpickr";
import createTask from "./createTask";
import distributeTask from "./distributeTask";

const addBtn = document.querySelector(".task-list__add-btn");
const modal = document.querySelector(".modal");
const container = document.querySelector(".container"); // container for blur content with modal

const modalTaskInput = document.querySelector(".modal__task-name");
const datePickerEl = document.querySelector(".modal__datepicker");
const timePickerEl = document.querySelector(".modal__timepicker");

const modalDatePicker = flatpickr(datePickerEl, {});
const modalTimePicker = flatpickr(timePickerEl, {
  enableTime: true,
  enableSeconds: false,
  noCalendar: true,
  time_24hr: true,
});

// ================================
//      Visual Logic of Modal
// ================================

function closeModal() {
  modalTaskInput.value = "";
  modalDatePicker.clear();
  modalTimePicker.clear();

  modal.classList.remove("scale-up-center");
  modal.classList.add("scale-down-center");
  setTimeout(() => {
    modal.style.display = "none";
    container.removeEventListener("click", closeModal);
  }, 400);
  container.classList.remove("blur-filter");
}

const modalCloseBtn = document.querySelector(".modal__close");
modalCloseBtn.addEventListener("click", closeModal);

addBtn.addEventListener("click", () => {
  modal.classList.remove("scale-down-center");
  modal.style.display = "block";

  modal.classList.add("scale-up-center");

  container.classList.add("blur-filter");
  setTimeout(() => {
    container.addEventListener("click", closeModal);
  }, 500);
});

// =====================================
//      Logic of adding new task
// =====================================

const submitBtn = document.querySelector(".modal__submit");

auth.onAuthStateChanged((user) => {
  async function addNewTask(event) {
    event.preventDefault();

    try {
      const timestampOfTask = new Date(
        datePickerEl.value + " " + timePickerEl.value
      ).getTime();
      const timestampOfCreating = Date.now();

      if (isNaN(timestampOfTask)) {
        throw new Error("Invalid date or time input");
      }

      const taskRef = doc(
        db,
        "users",
        user.uid,
        "tasks",
        String(timestampOfCreating)
      );

      await setDoc(taskRef, {
        text: modalTaskInput.value,
        date: new Date(timestampOfTask),
        isCompleted: false,
        id: String(timestampOfCreating),
      });

      const newTaskEl = createTask(
        modalTaskInput.value,
        timestampOfTask,
        false,
        String(timestampOfCreating)
      );

      if (!newTaskEl) {
        throw new Error("Failed to create new task element");
      }

      distributeTask(newTaskEl, timestampOfTask);

      closeModal();
    } catch (err) {
      console.error("Error with adding new task: ", err.message);
    }
  }

  submitBtn.addEventListener("click", addNewTask);
});

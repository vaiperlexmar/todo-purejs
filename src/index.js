"use strict";
import flatpickr from "flatpickr";
import { db, getTasks } from "./db";
import createTask from "./Task";

const addBtn = document.querySelector(".task-list__add-btn");
const modal = document.querySelector(".modal");
const container = document.querySelector(".container"); // container for blur content with modal
const datePicker = document.querySelector(".modal__datepicker");
const timePicker = document.querySelector(".modal__timepicker");

flatpickr(datePicker, {});
flatpickr(timePicker, {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: true,
});

// Modal window logic

addBtn.addEventListener("click", () => {
  modal.classList.remove("scale-down-center");
  modal.style.display = "block";

  modal.classList.add("scale-up-center");

  container.classList.add("blur-filter");
});

const modalCloseBtn = document.querySelector(".modal__close");

modalCloseBtn.addEventListener("click", () => {
  modal.classList.remove("scale-up-center");
  modal.classList.add("scale-down-center");
  setTimeout(() => {
    modal.style.display = "none";
  }, 400);
  container.classList.remove("blur-filter");
});

// Get tasks from DB
const taskList = document.querySelector(".task-list__tasks");

getTasks(db).then((tasks) => {
  tasks.map((task) => {
    taskList.appendChild(
      createTask(task["text"], "2", "1", task["isCompleted"])
    );
  });
});

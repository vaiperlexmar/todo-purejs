"use strict";

import flatpickr from "flatpickr";

const addBtn = document.querySelector(".task-list__add-btn");
const modal = document.querySelector(".modal");
const container = document.querySelector(".container"); // container for blur content with modal

const modalTaskInput = document.querySelector(".modal__task-name");
const modalDatePicker = document.querySelector(".modal__datepicker");
const modalTimePicker = document.querySelector(".modal__timepicker");

flatpickr(modalDatePicker, {});
flatpickr(modalTimePicker, {
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
  flatpickr(modalDatePicker).clear();
  flatpickr(modalTimePicker).clear();

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

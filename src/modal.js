"use strict";

import {db} from "./db";
import {collection, addDoc} from "firebase/firestore/lite";
import flatpickr from "flatpickr";

import distributeTask from "./distributeTask";
import createTask from "./createTask";

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

async function addNewTask(event) {
    event.preventDefault();
    const timeStamp = new Date(
        datePickerEl.value + " " + timePickerEl.value
    ).getTime();


    // собираем данные с инпутов в объект

    // создаем таску и добавляем в список distributeTask
    const newTaskEl = createTask(modalTaskInput.value, timeStamp, false);
    distributeTask(newTaskEl, timeStamp);

    // передаем в БД

    await addDoc(collection(db, "tasks"), {
        text: modalTaskInput.value,
        date: new Date(timeStamp),
        isComplete: false,
    });

    closeModal();
}

submitBtn.addEventListener("click", addNewTask);

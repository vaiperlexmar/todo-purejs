"use strict";

export default function createTask(text, date, time, isCompleted) {
  const listEl = document.createElement("li");
  listEl.classList.add("task");

  const checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.name = "isCompleted";
  checkboxEl.checked = isCompleted;
  checkboxEl.classList.add("task__checkbox");

  const textEl = document.createElement("p");
  textEl.textContent = text;
  textEl.classList.add("task__content");

  listEl.appendChild(checkboxEl);
  listEl.appendChild(textEl);

  return listEl;
}

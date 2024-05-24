"use strict";

export default function createTask(text, timestamp, isCompleted) {
  let date = new Date(timestamp);

  let dataAttrDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
  let dataAttrTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const listEl = document.createElement("li");
  listEl.classList.add("task");
  listEl.dataset.date = dataAttrDate;
  listEl.dataset.time = dataAttrTime;

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

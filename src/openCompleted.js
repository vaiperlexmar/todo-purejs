"use strict";

const completedSectionSwitcher = document.querySelector(
  ".task-list__complete-switcher"
);
const sublists = document.querySelectorAll(".task-list__sublist");
const taskListHeading = document.querySelector(".task-list__heading");

function openCompleted() {
  const completedTasksListEl = document.querySelector(".sublist_completed");

  if (!completedSectionSwitcher.classList.contains("active")) {
    completedTasksListEl.style.display = "block";
    completedSectionSwitcher.classList.add("active");
    for (let i = 0; i < 4; i++) {
      sublists[i].style.display = "none";
    }
    taskListHeading.addEventListener("click", openCompleted);
  } else {
    completedTasksListEl.style.display = "none";
    completedSectionSwitcher.classList.remove("active");
    for (let i = 0; i < 4; i++) {
      sublists[i].style.display = "block";
    }
    taskListHeading.removeEventListener("click", openCompleted);
  }
}

completedSectionSwitcher.addEventListener("click", openCompleted);

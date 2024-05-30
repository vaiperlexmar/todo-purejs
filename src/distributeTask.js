"use strict";

const overdueTasks = document.querySelector(".sublist_overdue");
const todayTasks = document.querySelector(".sublist_today");
const tomorrowTasks = document.querySelector(".sublist_tomorrow");
const futureTasks = document.querySelector(".sublist_future");
const completedTasks = document.querySelector(".sublist_completed");

const todayStartDay = new Date();
todayStartDay.setHours(0);
todayStartDay.setMinutes(0);

const todayFinishDay = new Date();
todayFinishDay.setHours(23);
todayFinishDay.setMinutes(59);

function distributeTask(newTask, newTaskTimestamp) {
  const startTodayTimestamp = todayStartDay.getTime();
  const finishTodayTimestamp = todayFinishDay.getTime();

  if (newTask.dataset.isCompleted === "true") {
    completedTasks.prepend(newTask);
  } else if (
    newTaskTimestamp >= startTodayTimestamp &&
    newTaskTimestamp <= finishTodayTimestamp
  ) {
    todayTasks.appendChild(newTask);
  } else if (newTaskTimestamp < startTodayTimestamp) {
    overdueTasks.appendChild(newTask);
  } else if (
    newTaskTimestamp > finishTodayTimestamp &&
    newTaskTimestamp - finishTodayTimestamp < 86400000
  ) {
    tomorrowTasks.appendChild(newTask);
  } else {
    futureTasks.appendChild(newTask);
  }
}

export default distributeTask;

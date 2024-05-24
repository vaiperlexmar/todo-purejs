"use strict";
import { db, getTasks } from "./db";
import createTask from "./Task";

// Get tasks from DB and setting to task lists
const overdueTasks = document.querySelector(".sublist_overdue");
const todayTasks = document.querySelector(".sublist_today");
const tomorrowTasks = document.querySelector(".sublist_tomorrow");
const futureTasks = document.querySelector(".sublist_future");

const todayStartDay = new Date();
todayStartDay.setHours(0);
todayStartDay.setMinutes(0);

const todayFinishDay = new Date();
todayFinishDay.setHours(23);
todayFinishDay.setMinutes(59);

getTasks(db).then((tasks) => {
  tasks.map((task) => {
    const taskTimestamp = task.date.seconds * 1000;
    const startTodayTimestamp = todayStartDay.getTime();
    const finishTodayTimestamp = todayFinishDay.getTime();

    let newTask = createTask(task.text, taskTimestamp, task.isComplete);

    // for today
    if (
      taskTimestamp >= startTodayTimestamp &&
      taskTimestamp <= finishTodayTimestamp
    ) {
      todayTasks.appendChild(newTask);
    } else if (taskTimestamp < startTodayTimestamp) {
      overdueTasks.appendChild(newTask);
    } else if (
      taskTimestamp > finishTodayTimestamp &&
      taskTimestamp - finishTodayTimestamp < 86400000
    ) {
      tomorrowTasks.appendChild(newTask);
    } else {
      futureTasks.appendChild(newTask);
    }
  });
});

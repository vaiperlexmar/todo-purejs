"use strict";
import { db, getTasks } from "./db";
import createTask from "./createTask";
import distributeTask from "./distributeTask";
import { greetingDefiner } from "./clock";

// Get tasks from DB and setting to task lists

getTasks(db).then((tasks) => {
  tasks.map((task) => {
    const taskTimestamp = task.date.seconds * 1000;
    const newTask = createTask(
      task.text,
      taskTimestamp,
      task.isComplete,
      task.id
    );

    distributeTask(newTask, taskTimestamp);
    greetingDefiner();
  });
});

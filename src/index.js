"use strict";
import { db, getTasks, auth } from "./setupFirebase";
import createTask from "./createTask";
import distributeTask from "./distributeTask";
import { greetingDefiner } from "./clock";

auth.onAuthStateChanged(function (user) {
  if (user) {
    if (window.location.pathname !== "/app") {
      window.location.href = "/app";
    } else {
      getTasks(db, user.uid).then((tasks) => {
        tasks.map((task) => {
          const taskTimestamp = task.date.seconds * 1000;
          const newTask = createTask(
            task.text,
            taskTimestamp,
            task.isCompleted,
            task.id
          );

          distributeTask(newTask, taskTimestamp);
          greetingDefiner();
        });
      });

      const fullNameEl = document.querySelector(".profile__name");

      fullNameEl.textContent = user.displayName;

      const logoutButton = document.querySelector(".profile__logout");

      const logout = async () => {
        await auth.signOut();
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      };

      logoutButton.addEventListener("click", logout);
    }
  }
});

const user = auth.currentUser;

// Get tasks from DB and setting to task lists

"use strict";
import { db, getTasks, auth } from "./setupFirebase";
import createTask from "./createTask";
import distributeTask from "./distributeTask";
import { greetingDefiner, runClockOnTargetPage } from "./clock";

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
      runClockOnTargetPage();

      // =====================================
      //      Fill personal information
      // =====================================

      const fullNameEl = document.querySelector(".profile__name");
      fullNameEl.textContent = user.displayName;
      const usernameEl = document.querySelector(".profile__username");
      usernameEl.textContent = "@" + user.displayName.trim().toLowerCase();

      const logoutButton = document.querySelector(".profile__logout");

      const logout = async () => {
        await auth.signOut();
        document.cookie = "";
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      };

      logoutButton.addEventListener("click", logout);
    }
  }
});

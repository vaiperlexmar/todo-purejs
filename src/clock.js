"use strict";

const hourArrow = document.getElementById("clock-hour");
const minuteArrow = document.getElementById("clock-minute");
const secondArrow = document.getElementById("clock-second");

setInterval(() => {
  const d = new Date(); //object of date()
  const hr = d.getHours();
  const min = d.getMinutes();
  const sec = d.getSeconds();
  const hr_rotation = 30 * hr + min / 2; //converting current time
  const min_rotation = 6 * min;
  const sec_rotation = 6 * sec;

  hourArrow.style.transform = `rotate(${hr_rotation}deg)`;
  minuteArrow.style.transform = `rotate(${min_rotation}deg)`;
  secondArrow.style.transform = `rotate(${sec_rotation}deg)`;
}, 1000);

const clockGreeting = document.querySelector(".clock__greeting");
const todayTasksElement = document.querySelector(".sublist_today");

function greetingDefiner() {
  let currentTask;
  const todayTasksList = todayTasksElement.childNodes;
  const currentHour = new Date().getHours();

  if (todayTasksElement.hasChildNodes()) {
    for (let node of todayTasksList) {
      if (
        new Date().getTime() - node.dataset.timestamp <= 3600000 &&
        new Date().getTime() - node.dataset.timestamp > 0
      ) {
        clockGreeting.textContent = `It's time for ${node.textContent}`;
        currentTask = node;
      }
    }
  }

  if (currentTask === undefined) {
    if (currentHour < 5 || currentHour > 21) {
      clockGreeting.textContent = "Good Night 🌆";
    } else if (currentHour > 5 && currentHour < 12) {
      clockGreeting.textContent = "Good Morning 🌅";
    } else if (currentHour > 12 && currentHour < 17) {
      clockGreeting.textContent = "Good Afternoon ☀️";
    } else if (currentHour > 17 && currentHour < 21) {
      clockGreeting.textContent = "Good Evening 🌇";
    }
  }
}

export { greetingDefiner };

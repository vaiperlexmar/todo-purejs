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

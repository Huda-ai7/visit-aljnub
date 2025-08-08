"use strict";

// update the copyright year
const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

/////////////////
// Calender
const monthYear = document.getElementById("month-year");
const datesContainer = document.getElementById("dates");
const prevMonuthYear = document.getElementById("prevM");
const nextMounthYear = document.getElementById("nextM");

let currentDate = new Date();
function renderCalender() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  //   set the month and the year in the header
  monthYear.textContent = `${new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(currentDate)} ${year}`;

  // clear the previous date
  datesContainer.innerHTML = "";

  // get the first day of the month and the number of the days in the month
  const firstDay = new Date(year, month, 1).getDay();
  const totalDay = new Date(year, month + 1, 0).getDate();

  // Get today's date
  const today = new Date();
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  // Add empty cells for days befor the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptDiv = document.createElement("div");
    emptDiv.classList.add("empty");
    datesContainer.appendChild(emptDiv);
  }

  // Add all dates
  for (let i = 1; i <= totalDay; i++) {
    const dateDiv = document.createElement("div");
    dateDiv.textContent = i;

    // Highlight the current day
    if (isCurrentMonth && i === today.getDate()) {
      dateDiv.classList.add("current-day");
    }

    datesContainer.appendChild(dateDiv);
  }
}

// Event listeners for previous and next month buttons
prevMonuthYear.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalender();
});

nextMounthYear.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalender();
});

// Initial render
renderCalender();

// count the number of post
const postc = document.getElementById("post-container");
const postCount = postc.querySelectorAll(".post").length;

const pnumbers = document.querySelector(".pnum");
pnumbers.textContent = postCount;

// selecting the events categories
let postCate = "all";

function filterEvents() {
  let postE = document.querySelectorAll(".post");
  let noMatch = document.getElementById("match-message");
  let matchFound = false;

  postE.forEach((post) => {
    let matches = postCate === "all" || post.classList.contains(postCate);
    if (matches) {
      post.style.display = "block";
      matchFound = true;
    } else {
      post.style.display = "none";
    }
  });
  noMatch.style.display = matchFound ? "none" : "block";
}

document.querySelectorAll(".cate-events a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    postCate = this.id;

    document
      .querySelectorAll(".cate-events a")
      .forEach((a) => a.classList.remove("active-cate"));
    this.classList.add("active-cate");

    filterEvents();
  });
});

filterEvents();

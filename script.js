const clock = document.getElementById("clock");
const dateElement = document.getElementById("date");

function updateClock() {
  const now = new Date();

  clock.textContent = now.toLocaleTimeString("en-GB");

  dateElement.textContent = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

updateClock();
setInterval(updateClock, 1000);


let count = 0;

const countElement = document.getElementById("count");

function renderCount() {
  countElement.textContent = count;
}

document.getElementById("increase").addEventListener("click", () => {
  count++;
  renderCount();
});

document.getElementById("decrease").addEventListener("click", () => {
  count--;
  renderCount();
});

document.getElementById("reset").addEventListener("click", () => {
  count = 0;
  renderCount();
});


document.getElementById("year").textContent =
  `© ${new Date().getFullYear()}`;

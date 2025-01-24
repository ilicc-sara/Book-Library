import "./style.css";

const newBookBtn = document.querySelector(".new-btn");
const form = document.querySelector(".form");
const overlay = document.querySelector(".overlay");

newBookBtn.addEventListener("click", function () {
  form.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

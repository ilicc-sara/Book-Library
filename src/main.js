import "./style.css";

const newBookBtn = document.querySelector(".new-btn");
const form = document.querySelector(".form");
const overlay = document.querySelector(".overlay");

const titleInput = document.querySelector(".title-input");
const authorInput = document.querySelector(".author-input");
const pagesInput = document.querySelector(".pages-input");

const bookCont = document.querySelector(".book-shelf");
const checkBox = document.querySelector(".checkbox");

newBookBtn.addEventListener("click", function () {
  form.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

function cardCreator() {
  let title = "";
  let author = "";
  let pages = "";
  const id = crypto.randomUUID();
  let isRead = false;

  const getTitle = () => title;
  const setTtitle = (value) => (title = value);

  const getAuthor = () => author;
  const setAuthor = (value) => (author = value);

  const getPages = () => pages;
  const setPages = (value) => (pages = value);

  const getId = () => id;

  const getIsRead = () => isRead;
  const changeStatus = (value) => (isRead = value);

  // prettier-ignore
  return {getTitle, setTtitle, getAuthor, setAuthor, getPages, setPages, getId, getIsRead, changeStatus};
}

function cardManagerCreator() {
  let books = [];

  const addBooks = (value) => books.push(value);
  const getBooks = () => books;
  const setBooks = (value) => (books = value);

  return { addBooks, getBooks, setBooks };
}

const cardManager = cardManagerCreator();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  form.classList.add("hidden");
  overlay.classList.add("hidden");

  const card = cardCreator();
  card.setTtitle(titleInput.value);
  card.setAuthor(authorInput.value);
  card.setPages(pagesInput.value);
  cardManager.addBooks(card);
  checkBox.checked ? card.changeStatus(true) : card.changeStatus(false);

  const item = document.createElement("div");
  item.classList.add("card");
  item.setAttribute("data-id", card.getId());
  item.innerHTML = `

  <input type="text" class="text text-1" placeholder=${card.getTitle()} readonly />
  <input type="text" class="text text-2" placeholder=${card.getAuthor()} readonly />
  <input type="number" class="text text-3" placeholder="${card.getPages()} pages" readonly />

  <div class="btn-cont">
  <button class="status-btn" id="${card.getId()}">${
    checkBox.checked ? "Read" : "Unread"
  }</button>
  <button class="edit-btn">Edit</button>
  <button class="delete-btn">Delete Book</button>
  </div>
  `;
  bookCont.appendChild(item);

  titleInput.value = "";
  authorInput.value = "";
  pagesInput.value = "";
  checkBox.checked = false;
});

const inputs = document.querySelectorAll(".text");

bookCont.addEventListener("click", function (e) {
  // prettier-ignore
  if (!e.target.classList.contains("status-btn") && !e.target.classList.contains("delete-btn") && !e.target.classList.contains("edit-btn")) return;

  const targetId = e.target.closest(".card").dataset.id;
  const targetBook = cardManager
    .getBooks()
    .find((book) => book.getId() === targetId);

  if (e.target.classList.contains("status-btn")) {
    // prettier-ignore
    !targetBook.getIsRead() ? targetBook.changeStatus(true) : targetBook.changeStatus(false);

    const element = document.getElementById(targetId);

    element.textContent = targetBook.getIsRead() ? "Read" : "Unread";
  }
  if (e.target.classList.contains("delete-btn")) {
    const newBooks = cardManager.getBooks().filter((book) => {
      return book.getId() !== targetId;
    });

    cardManager.setBooks(newBooks);

    const deleteEl = e.target.closest(".card");
    deleteEl.remove();
  }

  // if (e.target.classList.contains("edit-btn")) {
  //   inputs.forEach((input) => input.removeAttribute("readonly"));
  //   // inputs.removeAttribute("readonly");
  // }
});

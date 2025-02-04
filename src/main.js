import "./style.css";

const newBookBtn = document.querySelector(".new-btn");
const form = document.querySelector(".form");
const overlay = document.querySelector(".overlay");

const titleInput = document.querySelector(".input-title");
const authorInput = document.querySelector(".input-author");
const pagesInput = document.querySelector(".input-pages");

const bookCont = document.querySelector(".book-shelf");
const checkBox = document.querySelector(".checkbox");

newBookBtn.addEventListener("click", function () {
  form.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

let inputTitle;
let inputAuthor;
let inputPages;
let isRead = false;

titleInput.addEventListener("input", function (e) {
  inputTitle = e.target.value;
});
authorInput.addEventListener("input", function (e) {
  inputAuthor = e.target.value;
});
pagesInput.addEventListener("input", function (e) {
  inputPages = e.target.value;
});
checkBox.addEventListener("input", function (e) {
  isRead = e.target.checked;
});

function cardCreator(titl, athr, pgs, read) {
  let title = titl;
  let author = athr;
  let pages = pgs;
  const id = crypto.randomUUID();
  let isRead = read;
  let isEditing = false;

  const getTitle = () => title;
  const setTtitle = (value) => (title = value);

  const getAuthor = () => author;
  const setAuthor = (value) => (author = value);

  const getPages = () => pages;
  const setPages = (value) => (pages = value);

  const getId = () => id;

  const getIsRead = () => isRead;
  const changeStatus = (value) => (isRead = value);

  const getIsEditing = () => isEditing;
  const setIsEditing = (value) => (isEditing = value);

  // prettier-ignore
  return {getTitle, setTtitle, getAuthor, setAuthor, getPages, setPages, getId, getIsRead, changeStatus, getIsEditing, setIsEditing};
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

  console.log("isRead submit", isRead);
  console.log("check box", checkBox.checked);

  const card = cardCreator(inputTitle, inputAuthor, inputPages, isRead);
  cardManager.addBooks(card);

  const item = document.createElement("div");
  item.classList.add("card");
  item.setAttribute("data-id", card.getId());
  item.innerHTML = `

  <div class="info-cont">
          <p class="title">${card.getTitle()} </p>
          <p class="author">${card.getAuthor()} </p>
          <p class="pages">${card.getPages()} pages</p>
  </div>
  <div class="btn-cont">
  <button class="status-btn" id="${card.getId()}">${
    card.getIsRead() ? "Read" : "Unread"
  }</button>
  <button class="edit-btn">Edit</button>
   
  <button id="delete" class="delete-btn"><ion-icon id="delete" class="delete-icon" name="close-circle-outline"></ion-icon></button>
  </div>
  `;
  bookCont.appendChild(item);

  titleInput.value = "";
  authorInput.value = "";
  pagesInput.value = "";
  checkBox.checked = false;
});

const renderBooks = function () {
  cardManager.getBooks().forEach((book) => {
    const bookHtml = book.getIsEditing()
      ? `

      <form class="card" data-id="${book.getId()}">
    <div class="info-cont">
          <input type="text" class="edit title-input" value="${book.getTitle()}" />
          <input type="text" class="edit author-input" value="${book.getAuthor()}" />
          <input type="text" class="edit pages-input" value="${book.getPages()}" />
    </div>
    <div class="btn-cont">
   
     <button type="submit" class="submit-btn">Submit</button>
     <button id="delete" class="delete-btn"><ion-icon id="delete" class="delete-icon" name="close-circle-outline"></ion-icon></button>
    
    </div>
    </form>
    `
      : `
   <div class="card" data-id="${book.getId()}">
    <div class="info-cont">
            <p class="title">${book.getTitle()} </p>
            <p class="author">${book.getAuthor()} </p>
            <p class="pages">${book.getPages()} pages</p>
    </div>
    <div class="btn-cont">
    <button class="status-btn" id="${book.getId()}">${
          book.getIsRead() ? "Read" : "Unread"
        }</button>
    <button class="edit-btn">Edit</button>
    <button id="delete" class="delete-btn"><ion-icon id="delete" class="delete-icon" name="close-circle-outline"></ion-icon></button>
    </div>
    </div>
    `;
    bookCont.insertAdjacentHTML("afterbegin", bookHtml);

    if (book.getIsEditing()) {
      const form = document.querySelector(`[data-id="${book.getId()}"]`);
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        book.setIsEditing(false);

        let editedTitle = form.querySelector(".title-input").value;
        let editedAuthor = form.querySelector(".author-input").value;
        let editedPages = form.querySelector(".pages-input").value;

        book.setTtitle(editedTitle);
        book.setAuthor(editedAuthor);
        book.setPages(editedPages);
      });
    }
  });
};

bookCont.addEventListener("click", function (e) {
  // prettier-ignore
  if (!e.target.classList.contains("status-btn") && !e.target.id === "delete" && !e.target.classList.contains("edit-btn") && !e.target.classList.contains("submit-btn")) return;

  const targetId = e.target.closest(".card").getAttribute("data-id");
  const targetBook = cardManager
    .getBooks()
    .find((book) => book.getId() === targetId);

  if (e.target.classList.contains("status-btn")) {
    e.preventDefault();
    // prettier-ignore
    targetBook.getIsRead() ? targetBook.changeStatus(false) : targetBook.changeStatus(true);

    const element = document.getElementById(targetId);
    element.textContent = targetBook.getIsRead() ? "Read" : "Unread";
  }

  if (e.target.id === "delete") {
    e.preventDefault();
    const newBooks = cardManager.getBooks().filter((book) => {
      return book.getId() !== targetId;
    });
    cardManager.setBooks(newBooks);

    const deleteEl = e.target.closest(".card");
    deleteEl.remove();
  }

  if (e.target.classList.contains("edit-btn")) {
    e.preventDefault();

    bookCont.innerHTML = "";

    targetBook.setIsEditing(true);

    renderBooks();

    let targetCard = e.target;
    console.log(targetCard);
  }

  if (e.target.classList.contains("submit-btn")) {
    e.preventDefault();
    if (!targetBook.getIsEditing()) return;
    if (targetBook.getIsEditing()) targetBook.setIsEditing(false);

    // prettier-ignore
    let editedTitle = e.target.closest(".card").querySelector(".title-input").value;
    // prettier-ignore
    let editedAuthor = e.target.closest(".card").querySelector(".author-input").value;
    // prettier-ignore
    let editedPages = e.target.closest(".card").querySelector(".pages-input").value;

    targetBook.setTtitle(editedTitle);
    targetBook.setAuthor(editedAuthor);
    targetBook.setPages(editedPages);

    bookCont.innerHTML = "";

    renderBooks();
  }
});

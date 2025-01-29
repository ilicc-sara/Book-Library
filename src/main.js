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
let isRead;

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

  const card = cardCreator(inputTitle, inputAuthor, inputPages, isRead);
  // necemo ovako da kupimo vrednosti nego varijable a na input event listenere
  // umesto pozivanja set fja proslediti arg u card creator
  cardManager.addBooks(card);

  card.getIsRead() ? card.changeStatus(true) : card.changeStatus(false);

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
   <button class="submit-btn">Submit</button>
  <button class="delete-btn">Delete Book</button>
  </div>
  `;
  bookCont.appendChild(item);

  titleInput.value = "";
  authorInput.value = "";
  pagesInput.value = "";
  checkBox.checked = false;
});

// const inputs = document.querySelectorAll(".text");

bookCont.addEventListener("click", function (e) {
  // prettier-ignore
  if (!e.target.classList.contains("status-btn") && !e.target.classList.contains("delete-btn") && !e.target.classList.contains("edit-btn") && !e.target.classList.contains("submit-btn")) return;

  const targetId = e.target.closest(".card").dataset.id;
  const targetBook = cardManager
    .getBooks()
    .find((book) => book.getId() === targetId);

  if (e.target.classList.contains("status-btn")) {
    e.preventDefault();
    // prettier-ignore
    !targetBook.getIsRead() ? targetBook.changeStatus(true) : targetBook.changeStatus(false);

    const element = document.getElementById(targetId);

    element.textContent = targetBook.getIsRead() ? "Read" : "Unread";
  }
  if (e.target.classList.contains("delete-btn")) {
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
    // za edit:
    // dodati novo polje, novo parce stejta u card creator: isEditing: false
    // kada se klikne na btn edit toj knjizi promeniti isEditing u true
    // sada znas da je svim knjigama isEditing false osim kliknutoj
    // samo za isEditing true knjizi prikazati formu sa  inputima a za ostale normalno, ne menjaju se
    // samo za isEditing true knigu staviti submit event na formu
    // na submit naci tu knjigu u arr knjiga
    // promeniti isEditing na flase
    // sada je opet svima isEditing false, prikazuju se bez inputa

    bookCont.innerHTML = "";

    targetBook.setIsEditing(true);

    cardManager.getBooks().forEach((book) => {
      book.getIsRead() ? book.changeStatus(true) : book.changeStatus(false);

      if (!book.getIsEditing()) {
        const item = document.createElement("div");
        item.classList.add("card");
        item.setAttribute("data-id", book.getId());
        item.innerHTML = `

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
   <button class="submit-btn">Submit</button>
  <button class="delete-btn">Delete Book</button>
  </div>
  `;
        bookCont.appendChild(item);
      }

      if (book.getIsEditing()) {
        const item = document.createElement("form");
        item.classList.add("card");
        item.setAttribute("data-id", book.getId());
        item.innerHTML = `

  <div class="info-cont">
          <input type="text" class="edit title-input"  />
          <input type="text" class="edit author-input"  />
          <input type="text" class="edit pages-input"  />
  </div>
  <div class="btn-cont">
  <button class="status-btn" id="${book.getId()}">${
          book.getIsRead() ? "Read" : "Unread"
        }</button>
  <button class="edit-btn">Edit</button>
   <button class="submit-btn">Submit</button>
  <button class="delete-btn">Delete Book</button>
  </div>
  `;
        bookCont.appendChild(item);
      }
    });
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

    cardManager.getBooks().forEach((book) => {
      book.getIsRead() ? book.changeStatus(true) : book.changeStatus(false);

      if (!book.getIsEditing()) {
        const item = document.createElement("div");
        item.classList.add("card");
        item.setAttribute("data-id", book.getId());
        item.innerHTML = `

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
   <button class="submit-btn">Submit</button>
  <button class="delete-btn">Delete Book</button>
  </div>
  `;
        bookCont.appendChild(item);
      }
    });
  }
});

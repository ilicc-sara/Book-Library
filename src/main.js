import "./style.css";

const newBookBtn = document.querySelector(".new-btn");
const form = document.querySelector(".form");
const overlay = document.querySelector(".overlay");

const titleInput = document.querySelector(".title-input");
const authorInput = document.querySelector(".author-input");
const pagesInput = document.querySelector(".pages-input");

const bookCont = document.querySelector(".book-shelf");

newBookBtn.addEventListener("click", function () {
  form.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

function cardCreator() {
  let title = "";
  let author = "";
  let pages = "";
  const id = crypto.randomUUID();

  const getTitle = () => title;
  const setTtitle = (value) => (title = value);

  const getAuthor = () => author;
  const setAuthor = (value) => (author = value);

  const getPages = () => pages;
  const setPages = (value) => (pages = value);

  const getId = () => id;

  // prettier-ignore
  return {getTitle, setTtitle, getAuthor, setAuthor, getPages, setPages, getId};
}

function cardManagerCreator() {
  const books = [];

  const addBooks = (value) => books.push(value);
  const getBooks = () => books;

  return { addBooks, getBooks };
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

  cardManager.getBooks().forEach((book) => {
    const item = document.createElement("div");
    item.classList.add("card");
    item.setAttribute("data-id", book.getId());
    item.innerHTML = `
    <p class="book-name">${book.getTitle()}</p>
        <p class="book-author">${book.getAuthor()}</p>
        <p class="book-pages"><span class="book-num">${book.getPages()}</span> pages</p>
        <div class="btn-cont">
          <button class="status-btn">Unread</button>
          <button class="delete-btn">Delete Book</button>
        </div>
    `;
    bookCont.appendChild(item);
  });
  // cardManager
  //   .getBooks()
  //   .forEach((book) => console.log(book.getTitle(), book.getId()));
});

const storageKey = "STORAGE_KEY";
const formAddingBook = document.getElementById("inputBook");
const formSearchingBook = document.getElementById("searchBook");
formAddingBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const titleElement = document.getElementById("inputBookTitle");
  const authorElement = document.getElementById("inputBookAuthor");
  const yearElement = document.getElementById("inputBookYear");
  const isCompleteElement = document.getElementById("inputBookIsComplete");

  const title = titleElement.value;
  const author = authorElement.value;
  const year = parseInt(yearElement.value);
  const isComplete = isCompleteElement.checked;
  const idTemp = titleElement.name;

  if (idTemp !== "") {
    const bookData = GetBookList().map(book => book.id === idTemp ? { ...book, title, author, year, isComplete } : book);
    saveBookData(bookData);
    ResetAllForm();
    RenderBookList(bookData);
    return;
  }

  const id = (GetBookList()?.length || 0) + Date.now();
  const newBook = { id, title, author, year, isComplete };
  PutBookList(newBook);
  RenderBookList(GetBookList());
});

function PutBookList(data) {
  if (CheckForStorage()) {
    const bookData = JSON.parse(localStorage.getItem(storageKey)) || [];
    bookData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

function RenderBookList(bookData) {
  const containerIncomplete = document.getElementById("incompleteBookshelfList");
  const containerComplete = document.getElementById("completeBookshelfList");
  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";

  bookData.forEach(book => {
    const { id, title, author, year, isComplete } = book;
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = `<h3 name="${id}">${title}</h3><p>Penulis: ${author}</p><p>Tahun: ${year}</p>`;
    const containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");
    containerActionItem.append(CreateGreenButton(book), CreateRedButton());
    bookItem.append(containerActionItem);

    if (!isComplete) {
      containerIncomplete.append(bookItem);
    } else {
      containerComplete.append(bookItem);
    }

    bookItem.firstChild.addEventListener("click", function () {
      UpdateAnItem(this.parentElement);
    });
  });
}

function CreateGreenButton(book) {
  const isSelesai = book.isComplete ? "Belum selesai" : "Selesai";
  const greenButton = document.createElement("button");
  greenButton.classList.add("green");
  greenButton.innerText = `${isSelesai} di Baca`;
  greenButton.addEventListener("click", function () {
    isCompleteBookHandler(this.parentElement.parentElement);
    RenderBookList(GetBookList());
  });
  return greenButton;
}

function CreateRedButton() {
  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", function () {
    DeleteAnItem(this.parentElement.parentElement);
    RenderBookList(GetBookList());
  });
  return redButton;
}


function isCompleteBookHandler(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].title === title && bookData[index].id == titleNameAttribut) {
      bookData[index].isComplete = !bookData[index].isComplete;
      break;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function SearchBookList(title) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const bookList = [];

  for (let index = 0; index < bookData.length; index++) {
    const tempTitle = bookData[index].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (bookData[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
      bookList.push(bookData[index]);
    }
  }
  return bookList;
}

function GreenButtonHandler(parentElement) {
  let book = isCompleteBookHandler(parentElement);
  book.isComplete = !book.isComplete;
}

function GetBookList() {
  if (CheckForStorage) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
  return [];
}

function DeleteAnItem(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == titleNameAttribut) {
      bookData.splice(index, 1);
      break;
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function UpdateAnItem(itemElement) {
  if (itemElement.id === "incompleteBookshelfList" || itemElement.id === "completeBookshelfList") {
    return;
  }

  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.slice(9, itemElement.childNodes[1].innerText.length);
  const getYear = itemElement.childNodes[2].innerText.slice(7, itemElement.childNodes[2].innerText.length);
  const year = parseInt(getYear);

  const isComplete = itemElement.childNodes[3].childNodes[0].innerText.length === "Selesai di baca".length ? false : true;

  const id = itemElement.childNodes[0].getAttribute("name");
  document.getElementById("inputBookTitle").value = title;
  document.getElementById("inputBookTitle").name = id;
  document.getElementById("inputBookAuthor").value = author;
  document.getElementById("inputBookYear").value = year;
  document.getElementById("inputBookIsComplete").checked = isComplete;

  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == id) {
      bookData[index].id = id;
      bookData[index].title = title;
      bookData[index].author = author;
      bookData[index].year = year;
      bookData[index].isComplete = isComplete;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    RenderBookList(bookData);
    return;
  }
  const bookList = SearchBookList(title);
  RenderBookList(bookList);
});

function ResetAllForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;

  document.getElementById("searchBookTitle").value = "";
}

window.addEventListener("load", function () {
  if (CheckForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      const bookData = GetBookList();
      RenderBookList(bookData);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});

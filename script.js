const storageKey="STORAGE_KEY",formAddingBook=document.getElementById("inputBook");
function CheckForStorage(){return typeof Storage!=="undefined"}
formAddingBook.addEventListener("submit",e=>{
  const title=document.getElementById("inputBookTitle").value,author=document.getElementById("inputBookAuthor").value,year=+document.getElementById("inputBookYear").value,isComplete=document.getElementById("inputBookIsComplete").checked,idTemp=document.getElementById("inputBookTitle").name;
  if(idTemp!==""){
    const bookData=GetBookList();
    for(let book of bookData){
      if(book.id==idTemp){
        book.title=title;book.author=author;book.year=year;book.isComplete=isComplete;
      }
    }
    localStorage.setItem(storageKey,JSON.stringify(bookData));
    ResetAllForm();
    RenderBookList(bookData);
    return;
  }
  const id=JSON.parse(localStorage.getItem(storageKey))?JSON.parse(localStorage.getItem(storageKey)).length+Date.now():0+Date.now(),newBook={id,title,author,year,isComplete};
  PutBookList(newBook);
  RenderBookList(GetBookList());
});
function PutBookList(data){
  if(CheckForStorage()){
    let bookData=[];
    if(localStorage.getItem(storageKey)!==null){
      bookData=JSON.parse(localStorage.getItem(storageKey));
    }
    bookData.push(data);
    localStorage.setItem(storageKey,JSON.stringify(bookData));
  }
}
function RenderBookList(bookData){
  if(bookData===null){return}
  const containerIncomplete=document.getElementById("incompleteBookshelfList"),containerComplete=document.getElementById("completeBookshelfList");
  containerIncomplete.innerHTML="";
  containerComplete.innerHTML="";
  for(let book of bookData){
    const {id,title,author,year,isComplete}=book;
    let bookItem=document.createElement("article");
    bookItem.classList.add("book_item","select_item");
    bookItem.innerHTML=`<h3 name=${id}>${title}</h3><p>Penulis: ${author}</p><p>Tahun: ${year}</p>`;
    let containerActionItem=document.createElement("div");
    containerActionItem.classList.add("action");
    const greenButton=CreateGreenButton(book,e=>{
      isCompleteBookHandler(e.target.parentElement.parentElement);
      RenderBookList(GetBookList());
    });
    const redButton=CreateRedButton(e=>{
      DeleteAnItem(e.target.parentElement.parentElement);
      RenderBookList(GetBookList());
    });
    containerActionItem.append(greenButton,redButton);
    bookItem.append(containerActionItem);
    if(!isComplete){
      containerIncomplete.append(bookItem);
      bookItem.childNodes[0].addEventListener("click",e=>{
        UpdateAnItem(e.target.parentElement);
      });
    }
  }
}


//complete book
containerComplete.append(bookItem);

bookItem.childNodes[0].addEventListener("click", event => {
  UpdateAnItem(event.target.parentElement);
});

function CreateGreenButton(book, eventListener) {
  const isSelesai = book.isComplete ? "Belum selesai" : "Selesai";

  const greenButton = document.createElement("button");
  greenButton.classList.add("green");
  greenButton.innerText = isSelesai + " di Baca";
  greenButton.addEventListener("click", eventListener);
  return greenButton;
}
function CreateRedButton(eventListener) {
  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", eventListener);
  return redButton;
}

function isCompleteBookHandler(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) return;

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
  if (bookData.length === 0) return;

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
  if (bookData.length === 0) return;

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
  if (itemElement.id === "incompleteBookshelfList" || itemElement.id === "completeBookshelfList") return;

  const bookData = GetBookList();
  if (bookData.length === 0) return;

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.slice(9);
  const year = parseInt(itemElement.childNodes[2].innerText.slice(7));

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
}
// code ini juga
localStorage.setItem(storageKey, JSON.stringify(bookData));

searchBook.addEventListener("submit", event => {
  event.preventDefault();
  const bookData = GetBookList();
  if (bookData.length === 0) return;

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

window.addEventListener("load", () => {
  if (CheckForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      const bookData = GetBookList();
      RenderBookList(bookData);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});

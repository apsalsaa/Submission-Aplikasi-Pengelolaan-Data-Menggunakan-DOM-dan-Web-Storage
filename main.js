const modal = document.querySelector('#modal')
const addButton = document.getElementById('add-book');
const cancel = document.getElementById('cancel')
const incompleteBookID = "reading";
const completeBookID="read";
const itemBookID = "itemId";

const booksLength = () => {
  const totalBuku = document.getElementById('total');
  totalBuku.innerText = books.length;
}

const addNewBook = () => {
  const completedBook = document.getElementById(completeBookID);
  const inputTitle = document.getElementById('title').value;
  const inputAuthor = document.getElementById('author').value;
  const inputYear = document.getElementById('year').value;
  
  const book = makeBook(inputTitle, inputAuthor, inputYear, false)
  const bookObject = composeBookObject(inputTitle, inputAuthor, inputYear, false)
  
  book[itemBookID] = bookObject.id;
  books.push(bookObject);
  
  completedBook.append(book)
  updateDataToStorage();
}

const makeBook = (title, author, year, isIncompleted) => {
  
  const bookTitle = document.createElement('h4');
  bookTitle.innerText = title;
  
  const authorName = document.createElement('p');
  authorName.innerText = author;
  
  const bookYear = document.createElement('small');
  bookYear.innerText = `${year}`;
  
  const detail = document.createElement('div');
  detail.classList.add('detail-book')
  detail.append(bookTitle, authorName, bookYear)
  
  const container = document.createElement('div');
  container.classList.add('my-container');
  container.append(detail)
 
  if(isIncompleted){
        container.append(
            createReadButton(),
            createTrashButton()
        );
    } else {
        container.append(
          createReadingButton(),
          createTrashButton()
        );
    }
  return container;
}

const createButton = (buttonTypeClass, eventListener) => {
    const button  = document.createElement('button');
    button.classList.add(buttonTypeClass);
    
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

const createReadingButton = () => {
    return createButton("reading-button", function (event) {
        addBookToIncompleted(event.target.parentElement);
    });
}

const addBookToIncompleted = (bookElement) => {
  const bookIncompleted = document.getElementById(incompleteBookID);
  
	const bookTitle = bookElement.querySelector(".detail-book > h4").innerText;
  const bookAuthor = bookElement.querySelector(".detail-book > p").innerText;
  const bookYear = bookElement.querySelector(".detail-book > small").innerText;
 
  const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
  const book = findBook(bookElement[itemBookID]);
  book.isIncompleted = true;
  newBook[itemBookID] = book.id;
  
  bookIncompleted.append(newBook);
  bookElement.remove();
    
  updateDataToStorage();
} 

const removeFromIncompleted = (bookElement)  => {
  const bookPosition = findBookIndex(bookElement[itemBookID]);
  books.splice(bookPosition, 1);
  bookElement.remove();
  updateDataToStorage();
}

const createTrashButton = () => {
    return createButton("trash-book", function(event){
        removeFromIncompleted(event.target.parentElement);
    });
}

const undoFromIncompleted = (bookElement) => {
  const listCompleted = document.getElementById(completeBookID);
    
  const bookTitle = bookElement.querySelector(".detail-book > h4").innerText;
  const bookAuthor = bookElement.querySelector(".detail-book > p").innerText;
  const bookYear = bookElement.querySelector(".detail-book > small").innerText;
 
  const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
  const book = findBook(bookElement[itemBookID]);
  book.isIncompleted = false;
  newBook[itemBookID] = book.id;
  
  listCompleted.append(newBook);
  bookElement.remove();
  updateDataToStorage();
}

const createReadButton = () => {
  return createButton("read-button", function(event){
    undoFromIncompleted(event.target.parentElement);
  });
}

addButton.addEventListener("click", () => {
  modal.classList.toggle("modal-open")
})
cancel.addEventListener("click", () => {
  modal.style.transition = '1s';
  modal.classList.toggle("modal-open")
})

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    modal.classList.remove("modal-open");
    addNewBook();
  });

  if(checkStorage()){
    loadDatafromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Data tersimpan.");
  booksLength();
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
  booksLength();
});
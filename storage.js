const STORAGE_KEY = 'BOOK_APPS';
let books = [];

const checkStorage = () => {
  if(typeof(Storage) == undefined) {
    alert('Browser not support web storage');
    return false;
  }
  
  return true;
}

const saveData = () => {
  const parseData = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parseData);
  document.dispatchEvent(new Event('ondatasaved'));
}

const loadDatafromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);
  
  if(data !== null)
    books = data;
  
  document.dispatchEvent(new Event('ondataloaded'));
}

const updateDataToStorage = () => {
  if(checkStorage())
    saveData();
}

const composeBookObject = (bookTitle, bookAuthor, bookYear, isIncompleted) => {
  return {
    id: +new Date(),
    bookTitle,
    bookAuthor,
    bookYear,
    isIncompleted,
  }
}

const findBook = (bookId) => {
  for (book of books) {
    if(book.id === bookId)
      return book;
  }
  
  return null;
}

const findBookIndex = (bookId) => {
  let index = 0
  for (book of books) {
    if(book.id === bookId)
      return index;
 
    index++;
  }
 
   return -1;
}

const refreshDataFromBooks = () => {
  const bookCompleted = document.getElementById(completeBookID);
  let bookIncompleted = document.getElementById(incompleteBookID);

  for (book of books) {
    const newBook = makeBook(book.bookTitle, book.bookAuthor, book.bookYear , book.isIncompleted);
    newBook[itemBookID] = book.id;

    if (book.isIncompleted) {
      bookIncompleted.append(newBook);
    } else {
      bookCompleted.append(newBook);
    }
  }
}
// Your Code Here
let books = [];
let documentBookContainer = document.querySelector('.book-container')

//load the books
async function main(){
    let response = await fetch('http://localhost:3001/listBooks')
    books = await response.json()
    documentBookContainer.innerHTML = '';
    books.forEach(renderBook)
}

async function saveBook(){
    //find this particular form and save it
    await saveAllBooks();
    main();
}

function renderForm(book) {
    //find the single with this book id
    let bookContainer = document.querySelector(`[id='${book.id}']`);
    bookContainer.innerHTML = '';
    bookContainer.innerHTML = `
        <div class="card" style="width: 100%;">
            <label>Image URL</label><input type="text" class="image-edit" value="${book.imageURL}">
            <label>Title</label><input type="text" class="title-edit" value="${book.title}">
            <label>Description</label><input type="text" class="description-edit" value="${book.description}">
            <label>Quantity</label><input type="text" class="quantity-edit" value="${book.quantity}">
            <label>Year</label><input type="text" class="year-edit" value="${book.year}">
            <button onclick="saveBook()">Save Changes</button>
        </div>
    `

}

//display the books
function renderBook(book) {
    documentBookContainer.innerHTML += `
        <div class="col-sm-3 singlebook" id="${book.id}">
            <div class="card" style="width: 100%;">
                ${book.imageURL ? `
                    <img class="card-img-top" src="${book.imageURL}" />
                `
        : ``}
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Available: ${book.quantity}</h6>
                    <p class="card-text">${book.description}</p>
                    <button onclick="editBook(${book.id})">Edit</button>
                    <button onclick="deleteBook(${book.id})">Delete</button>
                </div>
            </div>
        </div>
    `
}

async function saveAllBooks(){
    const allbooks = document.querySelectorAll('.singlebook');
    for (let i = 0; i < allbooks.length; i++) {
        const singleBook = allbooks[i];
        //get the id
        const singleBookId = singleBook.id;
        //find any inputs for title, year, quantity, description and image url
        const title = singleBook.querySelector('.title-edit')?.value;
        const description = singleBook.querySelector('.description-edit')?.value;
        const quantity = singleBook.querySelector('.quantity-edit')?.value;
        const year = singleBook.querySelector('.year-edit')?.value;
        const imageURL = singleBook.querySelector('.image-edit')?.value;

        const allFieldsValid = [title, description, quantity, year, imageURL].every(value => value !== null && value !== undefined);
        if (allFieldsValid){
            const editBook = {
                id: Number(singleBookId),
                title,
                description,
                quantity,
                year,
                imageURL,
            }

            //save the book using the editBook object
            await fetch(`http://localhost:3001/updateBook`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editBook),
            })
        }
    }
}

async function editBook(bookId) {
    //save the changes of any existing item
    await saveAllBooks();
    await main();

    const book = books.find(book => book.id === bookId);
    // get the current fields but then swap them out with inputs
    renderForm(book)
}

async function deleteBook(bookId){
    await fetch(`http://localhost:3001/removeBook/${bookId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editBook),
    })
    await main();
}

//process new book form

main()

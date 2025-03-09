import { renderStars } from "./render_stars.js";

function createEmptyListMessage(){
    // If there are no books to show for a course, create a message to indicate this to the user
    const container = document.getElementById("empty_list__message_container");
    const html = `
    <p id="no_books_message">There are no books in the system yet. Please add new books <a href="./add_book_page.html">here</a>.</p>
    `;
    container.insertAdjacentHTML("beforeend", html);
}

async function fetchBooks() {
    // This function will query the database and get all the books 
    try {
        const response = await fetch("http://localhost:3000/books", { 
            method: "GET", 
        });
        if ( response.ok ){
            const data = await response.json();
            let books = data.data;
            if (books.length == 0 ){
                createEmptyListMessage();
            } else {
                books = books.map(book => ({
                    ...book, 
                    rating: parseFloat(book.rating.toFixed(1))
                }));
                await loadBooksTemplate(books); 
            }    
        }
    } catch (error) {
        console.error("Error fetching book list:", error);
    }
}

async function loadBooksTemplate(books) {
    try {
        Handlebars.registerHelper("renderStars", (rating) => renderStars(rating));
        const templateResponse = await fetch("/templates/add_book_to_course.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        // Generating the actual HTML with the books data
        const btnName = "Edit Book";
        const className = "edit_book_btn";
        const html = template({ books, btnName, className });
        // Inserting the generated HTML into the container
        document.getElementById("book_list_container").innerHTML = html;
    } catch (error) {
        console.error("Error loading books:", error);
    }
}

function searchForBook() {
    let filter = this.value.toLowerCase();
    let books = document.querySelectorAll("#books_list li");
    books.forEach((book) => {
        let title = book.getAttribute("book-title").toLowerCase();
        let isbn = book.getAttribute("book-isbn").toLowerCase().replace(/[^0-9]/g, '');
        let authors = book.getAttribute("book-authors").toLowerCase();

        if (title.includes(filter) || isbn.includes(filter) || authors.includes(filter) ) {
            book.style.display = "";
        } else {
            book.style.display = "none";
        }
    });
}

function resetFilter() {
    // function used in the html for onClick
    document.getElementById("search_input").value = "";
    let books = document.querySelectorAll("#books_list li");
    books.forEach((book) => {
        book.style.display = "";
    });
}

// Must load all the books when the page loads
document.addEventListener("DOMContentLoaded", async function(){
    await fetchBooks();
    document.getElementById("search_input").addEventListener("input",searchForBook );
    document.querySelectorAll(".edit_book_btn").forEach( button => {
        button.addEventListener("click", function () {
            const book_id = this.getAttribute("data-id");
            if ( book_id ) {
                // redirectioning with url parameters to later perform a GET request
                window.location.href = `./edit_book_page.html?bookId=${book_id}`;
            } 
        });
    });
});
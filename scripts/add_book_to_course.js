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
        const btnName = "Add Book";
        const className = "add_book_btn";
        const html = template({ books, btnName, className });
        // Inserting the generated HTML into the container
        document.getElementById("book_list_container").innerHTML = html;
    } catch (error) {
        console.error("Error loading books:", error);
    }
}

async function loadCourseDropdownTemplate(courses) {
    try {
        // Fetching the course_dropdown template
        const templateResponse = await fetch("/templates/course_dropdown.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const html = template({ courses }); // Generating the actual HTML
        document.getElementById("courses_container").innerHTML = html; // Inserting the html into the page that required it
    } catch (error) {
        console.error("Error loading template for courses' dropdown:", error);
    }
}

async function loadCourses() {
    try {
        const response = await fetch("http://localhost:3000/modules", { 
            method: "GET", // Get the list of courses already in the database
        });
        if ( !response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const isAdminStr = response.headers.get("IS-ADMIN");
        const isAdmin = isAdminStr == "1" ? true : false;
        window.currentUserStatus = isAdmin;
        const data = await response.json();
        const courses = data.data;
        await loadCourseDropdownTemplate(courses); 
    } catch (error) {
        console.error("Error fetching course list:", error);
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
    document.getElementById("search_input").value = "";
    let books = document.querySelectorAll("#books_list li");
    books.forEach((book) => {
        book.style.display = "";
    });
}

async function addBookToCourse(book_id, module_id) {
    try {
        let response = await fetch("http://localhost:3000/modules/addbook", { 
            method: "POST", // Making a POST request to log in the user
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ book_id, module_id }) 
        });
        if (response.ok) {
            alert("The book was successfully added!");
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } else {
            const data = await response.json();
            console.log("There was an error trying to add the book to the course, ", data);
            alert(`The book could not be added to the course. Error: ${data.error}`);
        } 
    } catch (error){
        console.log("There was an error trying to add the book to the course, ", error);
        alert("The book could not be added to the course. Error : ", error);
    }
}

// Must load all the courses when the page loads
document.addEventListener("DOMContentLoaded", async function(){
    await loadCourses();
    await fetchBooks();
    document.getElementById("search_input").addEventListener("input",searchForBook );
    document.getElementById("reset_filter").addEventListener("click",resetFilter );

    document.querySelectorAll(".add_book_btn").forEach( button => {
        button.addEventListener("click", function () {
            const book_id = this.getAttribute("data-id");
            const module_id = document.getElementById("course").value;
            if ( book_id && module_id ) {
                addBookToCourse(book_id, module_id);
            } else if (!module_id ){
                alert("You must select a course to add a book");
            }
        });
    });
});
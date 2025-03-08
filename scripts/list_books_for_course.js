import { renderStars } from "./render_stars.js";
import { suggestBookModal } from "./suggest_book_modal.js";
import { addReviewBookModal, showAddReviewModal, addEventListenerToModalButtons } from "./course_page_add_review_modal.js";
import { updateStars, addEventListenersToStars } from "./update_stars.js";

function getQueryParameter(parameterName) {
    // Function to get a query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

function createEmptyListMessage(){
    // If there are no books to show for a course, create a message to indicate this to the user
    const container = document.getElementById("empty_list__message_container");
    const html = `
    <p id="no_books_message">There are no books assigned to this course yet. Please add books to this course <a href="./add_book_to_course.html">here</a>.</p>
    `;
    container.insertAdjacentHTML("beforeend", html);
}

async function fetchBooksForModule(courseId) {
    // This function will query the database and get the list of books associated with this module
    try {
        const response = await fetch(`http://localhost:3000/modules/books/${courseId}`, { 
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
        console.error(`Error fetching book list for course ${courseId}: `, error);
    }
}

async function fetchGlobalData() {
    try {
        const response = await fetch("http://localhost:3000/user", { method: "GET"}); // get the information for the logged in user
        if (response.ok) {
            const data = await response.json(); // Converting the response of type ReadableStream into a JSON
            // Creating a global variables so they can be used on other scripts
            window.currentCourseId = getQueryParameter("courseId");
            window.currentCourseCode = getQueryParameter("courseCode");
            window.currentCourseName = getQueryParameter("courseName");
            window.currentUserId = data.id;
            window.currentUserStatus = data.role;
        } 
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}

async function loadBooksTemplate(books) {
    try {
        Handlebars.registerHelper("renderStars", (rating) => renderStars(rating));
        const templateResponse = await fetch("/templates/books_list.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const isAdminStr = window.currentUserStatus;
        const isAdmin = isAdminStr == "1" ? true : false;
        const isStudent = !isAdmin;
        // Generating the actual HTML with the books data
        const html = template({ books, isStudent});
        // Inserting the generated HTML into the container
        document.getElementById("book_list_container").innerHTML = html;
    } catch (error) {
        console.error("Error loading books:", error);
    }
}

function addEventListenerToSeeReviewsBtns(){
    document.querySelectorAll(".see_reviews_btn").forEach( button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const bookId = this.getAttribute("data-id");
            if (bookId) {
                window.location.href = `./reviews_page.html?bookId=${bookId}`;
            }
        });
    });
}

function addEventListenerToAddReviewBtns(){
    document.querySelectorAll(".review_book_btn").forEach( button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const bookId = this.getAttribute("data-id");
            const bookName = this.getAttribute("data-name");
            window.currentBookTitle = bookName;
            window.currentBookId = bookId;
            if (bookId && bookName) {
                showAddReviewModal(bookName, bookId);
            }
        });
    });
}

// Ensure that the books are loaded when the page content is ready
document.addEventListener("DOMContentLoaded", async function() {
    await fetchGlobalData(); // The data for the user and module must be set before loading the books
    document.getElementById("book_title_h2").textContent = `Book List for ${window.currentCourseName} ${window.currentCourseCode}`;
    await fetchBooksForModule(window.currentCourseId);
    await suggestBookModal();
    addEventListenerToSeeReviewsBtns();
    if (window.currentUserStatus == 0){
        // if the user is a student
        await addReviewBookModal();
        addEventListenerToModalButtons();
        addEventListenersToStars();
        updateStars(1);
        addEventListenerToAddReviewBtns();
    }
});

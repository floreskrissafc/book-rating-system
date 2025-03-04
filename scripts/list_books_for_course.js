import { renderStars } from "./render_stars.js";
import { suggestBookModal } from "./suggest_book_modal.js";

function getQueryParameter(parameterName) {
    // Function to get a query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

async function fetchBooksForModule(courseId) {
    // This function will query the database and get the list of books associated with this module
    try {
        const response = await fetch(`http://localhost:3000/modules/books/${courseId}`, { 
            method: "GET", 
        });
        if ( response.ok ){
            const data = await response.json();
            const books = data.data;
            loadBooksTemplate(books);  
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
        // Generating the actual HTML with the books data
        const html = template({ books });
        // Inserting the generated HTML into the container
        document.getElementById("book_list_container").innerHTML = html;
    } catch (error) {
        console.error("Error loading books:", error);
    }
}

// Ensure that the books are loaded when the page content is ready
document.addEventListener("DOMContentLoaded", async function() {
    await fetchGlobalData(); // The data for the user and module must be set before loading the books
    document.getElementById("book_title_h2").textContent = `Book List for ${window.currentCourseName} ${window.currentCourseCode}`;
    await fetchBooksForModule(window.currentCourseId);
    suggestBookModal();
});

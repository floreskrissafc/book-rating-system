import { renderStars } from "./render_stars.js";

async function fetchBooks() {
    // This function will query the database and get the list of books associated with this module
    try {
        const response = await fetch("http://localhost:3000/books", { 
            method: "GET", 
        });
        if ( response.ok ){
            const data = await response.json();
            const books = data.data;
            loadBooksTemplate(books);  
        }
    } catch (error) {
        console.error("Error fetching book list:", error);
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
    await fetchBooks();
});
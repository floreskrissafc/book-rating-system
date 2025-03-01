import { renderStars } from "./render_stars.js";

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        courseId: params.get("courseId"),
        courseName: params.get("courseName"),
        courseCode: params.get("courseCode"),
        userId: params.get("userId"),
        userStatus: params.get("userStatus") // this should be 1 or 2, 1 for admins
    };
}

// Extracting the id and name of the course from the url
//const { id: bookId, name: bookName } = getQueryParams();  // must uncomment this line

// placeholder values for now
const courseId = 1;
const courseName = "Logic";
const courseCode = "CM2035";
const userId = 2;
const userStatus = 2;

// Creating a global variable so it can be used on other scripts
window.currentCourseId = courseId;
window.currentCourseCode = courseCode;
window.currentCourseName = courseName;
window.currentUserId = userId;
window.currentUserStatus = userStatus;

async function loadBooks() {
    try {
        // Register the custom Handlebars helper to render the stars
        Handlebars.registerHelper("renderStars", (rating) => renderStars(rating));

        // Fetching the books template (you can adjust the path accordingly)
        const templateResponse = await fetch("/templates/books_list.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);

        // Fetching the books data from the backend API (this is just a placeholder)
        // const response = await fetch("/api/books");
        // const books = await response.json();

        const books = [
            {
                id: 1,
                title: "Introduction to Algorithms",
                isbn: "1234-2355-56",
                authors: "John Doe, Jane Smith",
                rating: 3.5,
                coverImage: "../imgs/books_cover/random.jpg"
            },
            {
                id: 2,
                title: "Clean Code",
                isbn: "978-0132350884",
                authors: "Robert C. Martin",
                rating: 4.5,
                coverImage: "../imgs/books_cover/default_book_cover.jpg"
            }
        ];

        // Generating the actual HTML with the books data
        const html = template({ books });

        // Inserting the generated HTML into the container
        document.getElementById("book_list_container").innerHTML = html;
    } catch (error) {
        console.error("Error loading books:", error);
    }
}

// Ensure that the books are loaded when the page content is ready
document.addEventListener("DOMContentLoaded", loadBooks);

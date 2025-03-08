/**
 * The navigation shouldn't include the books and courses if the user is not an admin IS-ADMIN
 * 0) Must create the window.isAdmin parameter for all the pages, needed for navigation
 * 1) The template shouldn't include by default the Courses and Books section, they should be included here
 * 2) Must make sure that there are no document.getElementById set in Courses or Books or 
 *   none of its items because that will cause errors because those elements won't exist for 
 *   students, just for admins
 * */ 
import { getUserInfo } from "./submitReview.js";

function addCoursesMenu() {
    // When the user is an admin, this function will be called
    // to include the Courses menu so they can add courses, add books
    // to existing courses and see all courses.
    var container = document.getElementById("navigation_links_container");
    var coursesMenu = `
        <div id="dropdown_2" class="dropdown">
            <a id="dropbtn_2" class="dropbtn" onClick="switchContentVisibility(2)">
                <p>Courses</p>
                <i class="fa fa-caret-down" id="caret_down_2"></i>
            </a>
            <div id="dropdown_content_2" class="dropdown-content">
                <a href="../pages/courses_page.html">See all courses</a>
                <a href="../pages/add_course_page.html">Add a course</a>
                <a href="../pages/add_book_to_course.html">Add book to course</a>
            </div>
        </div>
    `;
    container.insertAdjacentHTML("afterbegin", coursesMenu);
}

function addBooksMenu(){
    var container = document.getElementById("navigation_links_container");
    var booksMenu = `
        <div id="dropdown_1" class="dropdown">
            <a id="dropbtn_1" class="dropbtn" onClick="switchContentVisibility(1)">
                <p>Books</p>
                <i class="fa fa-caret-down" id="caret_down_1"></i>
            </a>
            <div id="dropdown_content_1" class="dropdown-content">
                <a href="../pages/books_page.html">See all books</a>
                <a href="../pages/add_book_page.html">Add a book</a>
            </div>
        </div>`;
    container.insertAdjacentHTML("afterbegin", booksMenu);
}

async function logOut(){
    // Make a request to log out from the system
    try {
        const response = await fetch("http://localhost:3000/users/logout", { method: "GET" });
        if (response.ok) {
            // The user was successfully logged out, redirect them to the log in page
            window.location.href = "../index.html";
        } 
    } catch (error) {
        console.error("Error logging out:", error);
    }
}

export async function loadNavBar() {
    try {
        const navContainer = document.getElementById("myTopnav");
        const response = await fetch("/templates/nav_template.hbs");
        const templateText = await response.text();
        const userData = await getUserInfo();
        const profile_picture = "../" + userData.profile_picture;
        const template = Handlebars.compile(templateText);
        const html = template({profile_picture});
        navContainer.innerHTML = html;
        const isAdmin = userData.role;
        window.currentUserStatus = isAdmin;
        if ( isAdmin ){ 
            // show the functionality for adding new books and courses only to admin users
            addCoursesMenu(); 
            addBooksMenu();
        } 
        document.body.style.visibility = "visible";
        document.getElementById("log_out_btn").addEventListener("click", logOut);

    } catch (error) {
        console.error("Error loading navbar:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadNavBar);

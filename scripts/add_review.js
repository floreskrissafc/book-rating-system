import { getUserInfo, submitNewBookReview } from "./submitReview.js";
import { fetchGlobalData, loadReviews, addEditModal  }  from "./list_reviews_for_book.js";

let selectedRating = 1;
let stars = [];
let ratingDisplay = null;

function updateStars(rating) {
    // Function that updates the stars visually by changing their class
    stars.forEach((star) => {
        const starValue = parseInt(star.getAttribute("data-value"));
        star.classList.toggle("filled", starValue <= rating);
    });
    ratingDisplay.textContent = rating;
}

function getQueryParameter(parameterName) {
    // Function to get a query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

async function fetchBook(book_id) {
    // This function will get the information for the current book
    try {
        const response = await fetch(`http://localhost:3000/books/${book_id}`, { 
            method: "GET", 
        });
        if ( response.ok ){
            const data = await response.json();
            window.currentBookId = data.id;
            window.currentBookName = data.title; 
            window.isAdmin = response.headers.get("IS-ADMIN") == 1 ? true : false ;
        }
    } catch (error) {
        console.error("Error fetching book info:", error);
    }
}

function renderBookInfo() {
    // Modify the titles of the page depending on the book
    document.getElementById("book_title_h2").textContent = `${window.currentBookName} Reviews`;
    document.querySelector("title").textContent = `Reviews for ${window.currentBookName}`; //
}

function addBtnAddReview(){
    // if the user not an admin then show a button to add a review for the book
    const container = document.getElementById("upper_container");
    const buttonHTML = `
            <div id="add_review_container">
                <button id="add_review_btn" type="button" class="button button_green">Add review</button>
            </div>
    `;
    container.insertAdjacentHTML("beforeend", buttonHTML);
}

async function submitReview() {
    let bookId = getQueryParameter("bookId");
    let userData = await getUserInfo();
    let userId = userData.id;
    let comment = document.getElementById("new_review_textarea").value;
    let rating = document.getElementById("selected_rating").textContent;
    let bookTitle = window.currentBookName;
    if ( userId && bookId && rating ){
        await submitNewBookReview(rating,userId,bookId,comment,bookTitle );
        location.reload();
    } 
}

function addEventListenersToModalButtons(){
    const addReviewModal = document.getElementById("add_review_modal");
    const submitReviewBtn = document.getElementById("submit_review");
    const cancelReviewBtn = document.getElementById("cancel_review");
    submitReviewBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Preventing the button from submitting the form
        console.log("submit review was called");
        submitReview();  
    });

    cancelReviewBtn.addEventListener("click", (event) => {
        const reviewForm = document.getElementById("new_review_form");
        console.log("cancel review was called");
        event.preventDefault(); // Preventing the button from submitting the form
        reviewForm.reset(); // Reset the form fields
        updateStars(1); // Reset the stars to default 1 star
        addReviewModal.style.display = "none";

    });
}

function addEventListenersToStars(){
    stars.forEach((star) => {
        //on hover call the updateStars function
        star.addEventListener("mouseover", function () {
            updateStars(parseInt(this.getAttribute("data-value")));
        });

        // on click, the rating must be final
        star.addEventListener("click", function () {
            selectedRating = parseInt(this.getAttribute("data-value"));
            updateStars(selectedRating);
        });
    });

    document.getElementById("new_review_star_rating").addEventListener("mouseleave", function () {
        updateStars(selectedRating); // Restore to selected rating when mouse leaves the star
    });
}

async function addModalForAddingReview(){
    try {
        let container = document.getElementById("main_content");
        const templateResponse = await fetch("/templates/add_review_modal.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const modalHTML = template();
        container.insertAdjacentHTML("beforeend", modalHTML);
        document.getElementById("add_review_modal_title").textContent = `Adding review for ${window.currentBookName}`;
        const addReviewModal = document.getElementById("add_review_modal");
        const addReviewBtn = document.getElementById("add_review_btn");
        addReviewBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Preventing the button from submitting the form
            addReviewModal.style.display = "flex";
        });
        addEventListenersToModalButtons();
        stars = document.querySelectorAll("#new_review_star_rating i");
        ratingDisplay = document.getElementById("selected_rating");
        updateStars(selectedRating);
        addEventListenersToStars();
    } catch (error) {
        console.error("error trying to fetch the template for add review modal: ", error);
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    let bookId = getQueryParameter("bookId");
    await fetchBook(bookId);
    await fetchGlobalData(); // The data for the user and module must be set before loading the books
    await loadReviews();
    renderBookInfo();
    if ( !window.isAdmin && !addEditModal ){
        addBtnAddReview(); 
        await addModalForAddingReview();
        let newReviewForm = document.getElementById("new_review_form");
        newReviewForm.classList.remove("form_box"); 
        newReviewForm.classList.add("new_review_form_container"); 
    }
});

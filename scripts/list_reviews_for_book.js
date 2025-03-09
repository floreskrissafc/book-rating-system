import { renderStars } from "./render_stars.js";
import { submitEditReview } from "./edit_review_modal.js";

export let addEditModal = false;
let selectedRating = 1;

function showDeleteModal() {
    const modal = document.getElementById("delete-modal");
    const modalTextContainer = document.getElementById("modal_content_text");
    modal.style.display = "flex";
    const confirmDeleteText = `Are you sure you want to delete this review? This will delete all the data related
                            to the review. This action cannot be undone.`;
    modalTextContainer.innerHTML = confirmDeleteText;
}

function addEventListenerToEditReviewFormBtns(){
    const submitEditReviewBtn = document.getElementById("submit_edit_review");
    const cancelEditReviewBtn = document.getElementById("cancel_edit_review");
    const editReviewForm = document.getElementById("edit_review_form");
    const editReviewModal = document.getElementById("edit_review_modal");

    submitEditReviewBtn.addEventListener("click", async function (event){
        event.preventDefault(); 
        await submitEditReview();
    });

    cancelEditReviewBtn.addEventListener("click", (event) => {
        event.preventDefault(); 
        editReviewForm.reset(); // Reset the form fields
        editReviewModal.style.display = "none";
    });
}

function updateEditedStars(new_rating) {
    const editStars = document.querySelectorAll("#edit_review_star_rating i");
    const editRatingDisplay = document.getElementById("edit_review_selected_rating");
    // Function that updates the stars visually by changing their class
    editStars.forEach((star) => {
        const starValue = parseInt(star.getAttribute("data-value"));
        star.classList.toggle("filled", starValue <= new_rating);
    });
    editRatingDisplay.textContent = new_rating;
}

function addEventListenerToStarsOnEditReviewForm(){
    const editStars = document.querySelectorAll("#edit_review_star_rating i");
    const starsContainer = document.getElementById("edit_review_star_rating");
    editStars.forEach((star) => {
        //on hover call the updateStars function
        star.addEventListener("mouseover", function () {
            updateEditedStars(parseInt(this.getAttribute("data-value")));
        });

        // on click, the rating must be final
        star.addEventListener("click", function () {
            selectedRating = parseInt(this.getAttribute("data-value"));
            updateEditedStars(selectedRating);
        });
    });

    starsContainer.addEventListener("mouseleave", function () {
        updateEditedStars(selectedRating); // Restore to selected rating when mouse leaves the star
    });
}

function handleReviewEditFormSubmission(rating){
    // Once the edit review form is created and filled with the current review
    // information, set up the necessary listeners for the stars and buttons
    selectedRating = rating;
    updateEditedStars(selectedRating);
    addEventListenerToEditReviewFormBtns(rating);
    addEventListenerToStarsOnEditReviewForm();
}

async function showEditModal(bookId, reviewText, rating, bookName, userId) {
    // When user clicks on an Edit button, a modal is shown so that
    // the user can edit the particular review
    try {
        const modal = document.getElementById("edit_review_modal");
        const formContainer = document.getElementById("edit_review_form_container");
        // Fetching the edit review template
        const templateResponse = await fetch("/templates/edit_review_modal.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const html = template({ bookId, bookName, rating, reviewText, userId }); // Fill the edit review template with the data for this review
        formContainer.innerHTML = html;
        handleReviewEditFormSubmission(rating);
        modal.style.display = "flex";
    } catch (error) {
        console.error("Error showing edit review modal:", error);
        return null;
    }
}

function hideDeleteModal() {
    const modal = document.getElementById("delete-modal");
    modal.style.display = "none";
}

async function deleteReview() {
    try {
        const modal = document.getElementById("delete-modal");
        const confirmDeleteBtn = document.getElementById("confirm-delete");
        // Sends the POST request to the server to delete this review
        let book_id = confirmDeleteBtn.getAttribute("data-bookId");
        let user_id = confirmDeleteBtn.getAttribute("data-userId");
        const response = await fetch("http://localhost:3000/reviews/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id, book_id })
        });
        if (response.ok) {
            modal.style.display = "none";
            alert("The review was deleted successfully"); 
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }  
    } catch (error ){
        console.log("There was an error trying to delete this review: ", error);
    }
    
}

async function fetchReviews(bookId) {
    try {
        // Register the custom Handlebars helper to render the stars
        Handlebars.registerHelper("renderStars", (rating) => renderStars(rating));
        // Fetching the reviews template
        const templateResponse = await fetch("/templates/reviews_list.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        // Fetching the reviews data from the backend API
        const response = await fetch(`http://localhost:3000/reviews/bybook/${bookId}`, {
            method: "GET",
        });
        let reviews = [];
        const data = await response.json();
        if (response.ok) {
            reviews = data.data;
            reviews = reviews.map(review => ({
                ...review,
                created_at: review.created_at.substring(0, 10) // Extracting only the date part "YYYY-MM-DD"
            }));

        } else {
            alert(`Error listing review for book: ${bookId}: ${data.error}`);
            console.log(`Error Fetching review for book ${bookId}`);
        }
        return { template, reviews };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return null;
    }
}

function renderReviews(template, reviews) {
    // Generating the actual HTML with the reviews data
    const html = template({ reviews });
    document.getElementById("review_list_container").innerHTML = html;
    // Check if there is at least one review created by the currentUser
    // that way we know if we should include a modal for editing a review or not
    const currentUserId = window.currentUserId;
    for (let i = 0; i < reviews.length; i++) {
        const userId = reviews[i].user_id;
        if (userId == currentUserId) {
            addEditModal = true;
            break;
        }
    }
}

function setupDeleteModal() {
    const mainContent = document.getElementById("main_content");
    const modalHTML = `
        <div id="delete-modal" class="modal">
            <div class="modal-content">
                <p id="modal_content_text" class="modal-content-text"></p>
                <div class="modal_btn_container">
                    <button id="confirm-delete" class="button button_red" data-bookId="" data-userId="">Yes, Delete</button>
                    <button id="cancel-delete" class="button button_gray">Cancel</button>
                </div>
            </div>
        </div>
    `;
    mainContent.insertAdjacentHTML("beforeend", modalHTML);
}

function setupEditModal() {
    // If the current user is the owner of at least one of the reviews
    // then create this modal so that they are able to edit their reviews
    const mainContent = document.getElementById("main_content");
    const modalHTML = `
            <div id="edit_review_modal" class="modal">
                <div id = "edit_review_form_container" class="modal-content">
                </div>
            </div>
    `;
    mainContent.insertAdjacentHTML("beforeend", modalHTML);
}

function attachAccordionListeners() {
    document.querySelectorAll(".review_text_container").forEach((panel) => {
        panel.addEventListener("click", function () {
            this.classList.toggle("expanded");
            const arrowIcon = this.querySelector(".review_arrow");
            if (arrowIcon) {
                arrowIcon.classList.toggle("fa-caret-down");
                arrowIcon.classList.toggle("fa-caret-up");
            }
        });
    });
}

function addEventListenersToDeleteModalButtons() {
    const cancelDeleteBtn = document.getElementById("cancel-delete");
    const confirmDeleteBtn = document.getElementById("confirm-delete");
    cancelDeleteBtn.addEventListener("click", hideDeleteModal);
    confirmDeleteBtn.addEventListener("click", async function(event){
        event.preventDefault();
        await deleteReview();
        location.reload();
    });

}

function addEventListenersToReviews(reviews, userStatus, currentUserId) {
    // Add Delete and Edit buttons to the reviews if certain conditions are met
    document.querySelectorAll(".review_info_container").forEach((container, index) => {
        const review = reviews[index];
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete_review_btn button button_red";
        deleteBtn.textContent = "Delete Review";
        deleteBtn.onclick = () => {
            const confirmDeleteBtn = document.getElementById("confirm-delete");
            confirmDeleteBtn.setAttribute("data-bookId",review.book_id);
            confirmDeleteBtn.setAttribute("data-userId",review.user_id);
            showDeleteModal();    
        };
        if (userStatus == 1) {
            container.querySelector(".review_right_box").appendChild(deleteBtn);
            addEventListenersToDeleteModalButtons();
        } 
        else if (userStatus == 0 && review.user_id == currentUserId) {
            // Add a button so the user can edit their own review
            const editBtn = document.createElement("button");
            const bookName = window.currentBookName;
            editBtn.className = "edit_review_btn button button_blue";
            editBtn.textContent = "Edit Review";
            editBtn.addEventListener("click", (event) =>{
                event.preventDefault();
                showEditModal(review.book_id, review.comment, review.rating, bookName, review.user_id);
            });
            container.querySelector(".review_right_box").appendChild(editBtn);
            // Add a button so the user can delete their own review
            container.querySelector(".review_right_box").appendChild(deleteBtn);
            addEventListenersToDeleteModalButtons();
        }
    });
}

function createEmptyListMessage(){
    // If there are no reviews for this book, let the user know with a message
    const userStatus = window.currentUserStatus;
    const messageAdmin = "There are no reviews for this book yet.";
    const messageStudent = "There are no reviews for this book yet. Be the first to add a review!";
    const container = document.getElementById("empty_list__message_container");
    let html = "";
    if ( userStatus == 1){
        html = `<p id="no_books_message">${messageAdmin}</p>`;
    } else {
        html = `<p id="no_books_message">${messageStudent}</p>`;
    }
    container.insertAdjacentHTML("beforeend", html);
    container.classList.add("visible_empty_list");
}

export async function loadReviews() {
    const userStatus = window.currentUserStatus;
    const currentUserId = window.currentUserId;
    const bookId = window.currentBookId;
    try {
        const data = await fetchReviews(bookId);
        const { template, reviews } = data;
        if (reviews.length == 0 ){
            createEmptyListMessage();
        } else {
            renderReviews(template, reviews);
            attachAccordionListeners();
            if (userStatus == 1) {
                setupDeleteModal();
            } 
            else if (userStatus == 0 && addEditModal) {
                setupEditModal();
                setupDeleteModal();
            }
            addEventListenersToReviews(reviews, userStatus, currentUserId);
        } 
    } catch (error) {
        console.error(`Error fetching reviews for book ${bookId}:`, error);
        return null;
    }
}

export async function fetchGlobalData() {
    try {
        const response = await fetch("http://localhost:3000/user", { method: "GET"}); // get the information for the logged in user
        if (response.ok) {
            const data = await response.json(); // Converting the response of type ReadableStream into a JSON
            // Creating a global variables so they can be used on other scripts
            window.currentBookId = getQueryParameter("bookId");
            window.currentUserId = data.id;
            window.currentUserStatus = data.role;
        } 
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}


function getQueryParameter(parameterName) {
    // Function to get a query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}


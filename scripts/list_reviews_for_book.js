import { renderStars } from "./render_stars.js";
import { fillEditForm, submitEditReview } from "./edit_review_modal.js";

let addEditModal = false;

function showDeleteModal(review) {
    const modal = document.getElementById(`delete-modal-${review.user_id}-${review.book_id}`);
    const modalTextContainer = document.getElementById("modal_content_text");
    modal.style.display = "flex";
    const confirmDeleteText = `Are you sure you want to delete this review by ${review.first_name} ${review.last_name} ? This will delete all the data related
                            to the review. This action cannot be undone.`;
    modalTextContainer.innerHTML = confirmDeleteText;
}

async function showEditModal(review) {
    // When user clicks on an Edit button, a modal is shown so that
    // the user can edit the particular review
    try {
        const modal = document.getElementById(`edit_review_modal-${review.user_id}-${review.book_id}`);
        const formContainer = document.getElementById(`edit_review_form_container-${review.user_id}-${review.book_id}`);
        // Fetching the edit review template
        const templateResponse = await fetch("/templates/edit_review_modal.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const { rating, comment, user_id } = review;
        const bookName = window.currentBookName;
        const html = template({ bookName, rating, comment, user_id }); // Fill the template with the data for this review
        formContainer.innerHTML = html;
        await fillEditForm(review);
        loadReviews();
        modal.style.display = "flex";
    } catch (error) {
        console.error("Error showing edit review modal:", error);
        return null;
    }
}

function hideDeleteModal(review) {
    const modal = document.getElementById(`delete-modal-${review.user_id}-${review.book_id}`);
    modal.style.display = "none";
}

async function deleteReview(review) {
    const modal = document.getElementById(`delete-modal-${review.user_id}-${review.book_id}`);
    // Sends the POST request to the server to delete this review
    // TODO
    const { user_id, book_id } = review;

    const response = await fetch("http://localhost:3000/reviews/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id, book_id })
    });
    const data = response.json();
    if (response.ok) {
        alert("The review was deleted successfully"); // placeholder for now
    } else {
        alert(`Error: ${data.error}`);
    }

    modal.style.display = "none";
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
        // const response = await fetch("/api/bookId");
        // const reviews = await response.json();

        const response = await fetch(`http://localhost:3000/reviews/bybook/${bookId}`, {
            method: "GET",
        });

        let reviews = [];
        const data = await response.json();
        if (response.ok) {
            reviews = data.data;
        } else {
            alert(`Error listing review for book: ${bookId}: ${data.error}`);
            console.log(`Error Fetching review for book ${bookId}`);
        }
        
        // reviews = [
        //     {
        //         id: 1,
        //         userId: 1,
        //         name: "Ada",
        //         lastName: "Smith",
        //         profilePic: "../imgs/user_profiles/default_profile.png",
        //         creationDate: "04/12/2024",
        //         rating: 3,
        //         reviewText:
        //             "Lorem ipsum odor amet, consectetuer adipiscing elit. Curae sem arcu sociosqu massa nec commodo natoque. Lectus mollis erat dapibus; torquent mollis tempor. Risus sit risus ultrices pellentesque sed cursus ullamcorper natoque. Aliquet natoque facilisis litora blandit aenean cursus ultrices. Phasellus neque aenean mattis, rutrum montes egestas non nibh. Torquent porttitor volutpat; laoreet placerat amet ipsum neque venenatis taciti. Curabitur ridiculus quisque aliquam maecenas dignissim. Erat sociosqu interdum proin aptent cubilia rutrum. Bibendum platea facilisi fermentum blandit finibus ac."
        //     },
        //     {
        //         id: 2,
        //         userId: 2,
        //         name: "John",
        //         lastName: "Doenaher",
        //         profilePic: "../imgs/user_profiles/default_profile.png",
        //         creationDate: "02/01/2025",
        //         rating: 4,
        //         reviewText: "Lorem ipsum dolor sit amet..."
        //     }
        // ];
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

function setupDeleteModal(review) {
    const mainContent = document.getElementById("main_content");
    const modalHTML = `
        <div id="delete-modal-${review.user_id}-${review.book_id}" class="modal">
            <div class="modal-content">
                <p id="modal_content_text" class="modal-content-text"></p>
                <div class="modal_btn_container">
                    <button id="confirm-delete-${review.user_id}-${review.book_id}" class="button button_red">Yes, Delete</button>
                    <button id="cancel-delete-${review.user_id}-${review.book_id}" class="button button_gray">Cancel</button>
                </div>
            </div>
        </div>
    `;
    mainContent.insertAdjacentHTML("beforeend", modalHTML);
}

function setupEditModal(review) {
    // If the current user is the owner of at least one of the reviews
    // then create this modal so that they are able to edit their reviews
    const mainContent = document.getElementById("main_content");
    const modalHTML = `
            <div id="edit_review_modal-${review.user_id}-${review.book_id}" class="modal">
                <div id = "edit_review_form_container-${review.user_id}-${review.book_id}" class="modal-content">
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

function addEventListenersToReviews(reviews, userStatus, currentUserId) {
    document.querySelectorAll(".review_info_container").forEach((container, index) => {
        const review = reviews[index];
        const btn = document.createElement("button");
        if (userStatus == 1) {
            const confirmDeleteBtn = document.getElementById(`confirm-delete-${review.user_id}-${review.book_id}`);
            const cancelDeleteBtn = document.getElementById(`cancel-delete-${review.user_id}-${review.book_id}`);

            btn.className = "delete_review_btn button button_red";
            btn.textContent = "Delete";
            btn.onclick = () => showDeleteModal(review);
            container.querySelector(".review_right_box").appendChild(btn);

            confirmDeleteBtn.addEventListener("click", function () {
                deleteReview(review);
            });

            cancelDeleteBtn.addEventListener("click", function () {
                hideDeleteModal(review);
            });
        } else if (userStatus == 0 && review.user_id == currentUserId) {
            const bookName = window.currentBookName;
            btn.className = "edit_review_btn button button_blue";
            btn.textContent = "Edit";
            btn.onclick = () => showEditModal(review);
            container.querySelector(".review_right_box").appendChild(btn);
        }
    });
}

async function loadReviews() {
    console.log('loadReviews called');
    const userStatus = window.currentUserStatus;
    const currentUserId = window.currentUserId;
    const bookId = window.currentBookId;
    try {
        const data = await fetchReviews(bookId);
        const { template, reviews } = data;
        renderReviews(template, reviews);
        attachAccordionListeners();
        reviews.forEach(review => {
            if (userStatus == 1) {
                setupDeleteModal(review);
            } else if (userStatus == 0 && addEditModal) {
                setupEditModal(review);
            }
        });
        addEventListenersToReviews(reviews, userStatus, currentUserId);
    } catch (error) {
        console.error(`Error fetching reviews for book ${bookId}:`, error);
        return null;
    }
}

async function fetchGlobalData() {
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

document.addEventListener("DOMContentLoaded",  async function() {
    await fetchGlobalData(); // The data for the user and module must be set before loading the books
    loadReviews();
});

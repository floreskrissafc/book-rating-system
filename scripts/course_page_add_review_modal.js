import { updateStars } from "./update_stars.js";
import { submitNewBookReview } from "./submitReview.js";

export async function addReviewBookModal() {
    try {
        let container = document.getElementById("main_content");
        const templateResponse = await fetch("/templates/add_review_modal.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const modalHTML = template();
        container.insertAdjacentHTML("beforeend", modalHTML);
    } catch (error) {
        console.error("Error adding add review form:", error);
    }
}

async function submitReview() {
    let user_id = window.currentUserId;
    let book_id = window.currentBookId;
    let book_title = window.currentBookTitle;
    let rating = document.getElementById("selected_rating").textContent;
    let comment = document.getElementById("new_review_textarea").value;
    await submitNewBookReview(rating, user_id, book_id, comment, book_title);
    hideAddReviewModal();
}

function hideAddReviewModal() {
    const modal = document.getElementById("add_review_modal");
    document.getElementById("new_review_form").reset();
    modal.style.display = "none";
}

export function addEventListenerToModalButtons() {
    let submitBtn = document.getElementById("submit_review");
    let cancelBtn = document.getElementById("cancel_review");
    submitBtn.onclick = (event) => {
        event.preventDefault();
        submitReview();
    };
    cancelBtn.onclick = (event) => {
        event.preventDefault();
        updateStars(1);
        hideAddReviewModal();
    };
}

export function showAddReviewModal(book_name, book_id) {
    let submitBtn = document.getElementById("submit_review");
    let title = document.getElementById("add_review_modal_title");
    title.textContent = `Add review to: ${book_name}`;
    submitBtn.setAttribute("data-id", book_id);
    const modal = document.getElementById("add_review_modal");
    modal.style.display = "flex";
}





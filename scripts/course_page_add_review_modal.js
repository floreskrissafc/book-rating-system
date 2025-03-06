import { updateStars } from "./update_stars.js";

export async function addReviewBookModal() {
    try {
        let container = document.getElementById("main_content");
        // const formContainer = document.getElementById("add_review_form_box");
        const templateResponse = await fetch("/templates/add_review_modal.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const modalHTML = template();
        container.insertAdjacentHTML("beforeend", modalHTML);
    } catch (error) {
        console.error("Error adding add review form:", error);
    }
}

function submitReview() {
    alert("Book review was posted");
    // must get the data-id of the button to actually make the request
    // TODO: implement server side request to post the book suggestion
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





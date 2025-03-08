export async function addRemoveBookModal() {
    try {
        let container = document.getElementById("main_content");
        const html = `
        <div id="delete-modal" class="modal">
            <div class="modal-content">
                <p>This action will remove the book from this course. It will not delete the book from the system.</p>
                <div class="modal_btn_container">
                    <button id="confirm_remove" class="button button_red" data-bookId="" data-courseId="" type="submit">
                        Yes, remove book.
                    </button>
                    <button id="cancel_remove" class="button button_gray" type="button">Cancel</button>
                </div>
            </div>
        </div>`;
        container.insertAdjacentHTML("beforeend", html);
        addEventListenerToRemoveBookModalButtons();
    } catch (error) {
        console.error("Error adding remove book modal:", error);
    }
}

function hideRemoveBookModal() {
    const modal = document.getElementById("delete-modal");
    modal.style.display = "none";
}

export function addEventListenerToRemoveBookModalButtons() {
    let confirmBtn = document.getElementById("confirm_remove");
    let cancelBtn = document.getElementById("cancel_review");
    confirmBtn.onclick = (event) => {
        event.preventDefault();
        removeBookFromCourse();
    };
    cancelBtn.onclick = (event) => {
        event.preventDefault();
        hideRemoveBookModal();
    };
}

export async function removeBookFromCourse() {
    //TODO : make the request to the back end to remove the book from the course
    // let user_id = window.currentUserId;
    // let book_id = window.currentBookId;
    // let book_title = window.currentBookTitle;
    // let rating = document.getElementById("selected_rating").textContent;
    // let comment = document.getElementById("new_review_textarea").value;
    // hideRemoveBookModal();
    // alert("The book was removed from this course");
    // location.reload();
}
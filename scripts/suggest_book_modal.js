function addSuggestBookBtn() {
    let container = document.getElementById("upper_container");
    const buttonHTML = `
            <div id="suggest_book_container">
                <button id="suggest_book_btn" type="button" class="button button_green">Suggest a book</button>
            </div>
    `;
    container.insertAdjacentHTML("beforeend", buttonHTML);
}

function addSuggestBookModal() {
    let container = document.getElementById("main_content");
    const modalHTML = `
        <div id="suggest_book_modal" class="modal">
            <div id="suggest_book_form_box" class="modal_content"></div>
        </div>`;
    container.insertAdjacentHTML("beforeend", modalHTML);
}

async function addSuggestBookForm() {
    try {
        const modal = document.getElementById("suggest_book_modal");
        const formContainer = document.getElementById("suggest_book_form_box");
        const templateResponse = await fetch("/templates/suggest_book_modal.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const html = template();
        formContainer.innerHTML = html;
    } catch (error) {
        console.error("Error adding suggest book form:", error);
        return null;
    }
}

function showSuggestABookModal() {
    const modal = document.getElementById("suggest_book_modal");
    modal.style.display = "flex";
}

function addEventListenerToSuggestBookButton() {
    let btn = document.getElementById("suggest_book_btn");
    btn.onclick = () => showSuggestABookModal();
}

function submitSuggestBookForm() {
    alert("Suggestion was posted");
    // TODO: implement server side request to post the book suggestion
}

function hideModal() {
    const modal = document.getElementById("suggest_book_modal");
    document.getElementById("suggest_a_book_form").reset();
    modal.style.display = "none";
}

function addEventListenerToModalButtons() {
    let submitBtn = document.getElementById("submit_btn");
    let cancelBtn = document.getElementById("cancel_btn");
    submitBtn.onclick = () => submitSuggestBookForm();
    cancelBtn.onclick = () => hideModal();
}

export async function suggestBookModal() {
    const userStatus = window.currentUserStatus;
    const currentUserId = window.currentUserId;
    const courseId = window.currentCourseId;
    const courseName = window.currentCourseName;
    const courseCode = window.currentCourseCode;
    console.log("userStatus = ", userStatus);
    console.log("courseId = ", courseId);
    console.log("courseName = ", courseName);
    console.log("courseCode = ", courseCode);
    if (userStatus == 0) {
        addSuggestBookBtn();
        addSuggestBookModal();
        await addSuggestBookForm();
        addEventListenerToSuggestBookButton();
        addEventListenerToModalButtons();
    }
}

// document.addEventListener("DOMContentLoaded", suggestBookModal);

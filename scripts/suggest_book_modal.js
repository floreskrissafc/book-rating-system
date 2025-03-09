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

async function submitSuggestBookForm() {
    const form = document.getElementById("suggest_a_book_form");
    const title = document.getElementById("book_title_input").value;
    const isbn = document.getElementById("ISBN_input").value;
    const module_id = window.currentCourseId;
    try {
        const response = await fetch("http://localhost:3000/books/propose", { 
            method: "POST", // Making a POST request to propose a new book for a course
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ module_id, title, isbn }) 
        });
        if (response.ok) {
            // If the book was successfully added to the system then alert the user
            alert("Your suggestion was saved into our system. Our staff will receive and act on your suggestion if it is approved.");
            form.reset();
            hideModal();
        } else {
            const data = await response.json();
            alert(`The book could not be added to the course. Error: ${data.error}`);
        } 
    } catch (error){
        console.log(`There was an error when trying to create the module ${name}`, error);
    }
}

function hideModal() {
    const modal = document.getElementById("suggest_book_modal");
    document.getElementById("suggest_a_book_form").reset();
    modal.style.display = "none";
}

function addEventListenerToModalButtons() {
    let submitBtn = document.getElementById("submit_btn");
    let cancelBtn = document.getElementById("cancel_btn");
    submitBtn.addEventListener("click", async function(event) {
        event.preventDefault();
        await submitSuggestBookForm();
    }); 
    cancelBtn.onclick = () => hideModal();
}

export async function suggestBookModal() {
    const userStatus = window.currentUserStatus;
    if (userStatus == 0) {
        addSuggestBookBtn();
        addSuggestBookModal();
        await addSuggestBookForm();
        addEventListenerToSuggestBookButton();
        addEventListenerToModalButtons();
    }
}

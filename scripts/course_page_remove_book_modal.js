export function addRemoveBookModal() {
    try {
        let container = document.getElementById("main_content");
        const html = `
        <div id="delete-modal" class="modal">
            <div id="remove_book_modal_content" class="modal-content">
                <p class="remove_book_text">This action will remove the book from this course. It will not delete the book from the system.</p>
                <div class="modal_btn_container">
                    <button id="confirm_remove" class="button button_red" data-bookId="" data-courseId="" type="submit">
                        Yes, remove book
                    </button>
                    <button id="cancel_remove" class="button button_gray" type="button">Cancel</button>
                </div>
            </div>
        </div>`;
        container.insertAdjacentHTML("beforeend", html);
    } catch (error) {
        console.error("Error adding remove book modal:", error);
    }
}

function hideRemoveBookModal() {
    const modal = document.getElementById("delete-modal");
    modal.style.display = "none";
}

export function showRemoveBookModal(){
    console.log("went inside the showRemoveBookModal function");
    const modal = document.getElementById("delete-modal");
    modal.style.display = "flex";
}

export function addEventListenerToRemoveBookModalButtons() {
    let confirmBtn = document.getElementById("confirm_remove");
    let cancelBtn = document.getElementById("cancel_remove");
    confirmBtn.addEventListener("click", async function(event){
        event.preventDefault();
        await removeBookFromCourse();
        location.reload();
    });
    cancelBtn.onclick = (event) => {
        event.preventDefault();
        hideRemoveBookModal();
    };
}

export async function removeBookFromCourse() {
    try {
        console.log("remove book from course was called");
        let book_id = window.currentBookId;
        let module_id = window.currentCourseId;
        let response = await fetch("http://localhost:3000/modules/removebook", { 
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ book_id, module_id }) 
        });
        if ( response.ok ){
            alert("The book was successfully removed from this course");
        } else {
            const data = await response.json();
            console.log("There was an error trying to remove book from course:", data);
            alert(`This book could not be removed from this course. Error: ${data.error}`);
        }
    } catch (error){
        console.log("The book could not be removed from this course. Error: ", error);
    }
}
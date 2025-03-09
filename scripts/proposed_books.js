async function getProposedBooks() {
    try {
        const response = await fetch("http://localhost:3000/books/proposed", { 
            method: "GET", // Get the list of courses already in the database
        });
        if ( !response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json(); // Converting the response of type ReadableStream into a JSON
        const books = data.data;
        await loadProposedBooksTemplate(books); 
    } catch (error) {
        alert("Error fetching proposed books list:", error);
    }
}

async function loadProposedBooksTemplate(books) {
    try {
        // Fetching the courses template
        const templateResponse = await fetch("/templates/proposed_books.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const html = template({ books }); // Generating the actual HTML
        document.getElementById("proposed_books_list").innerHTML = html; // Inserting the html into the page that required it
    } catch (error) {
        console.error("Error loading template for proposed books:", error);
    }
}

async function deleteProposedBook(){
    try {
        let confirmBtn = document.getElementById("confirm_remove");
        let id = confirmBtn.getAttribute("data-id");
        let response = await fetch("http://localhost:3000/books/removeproposed", { 
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id }) 
        });
        if ( response.ok ){
            alert("The proposed book was successfully removed from the system");
            location.reload();
        } else {
            const data = await response.json();
            alert(`There was an error trying to remove the proposed book: ${data.error}`);
            
        }
    } catch (error){
        console.log("The book could not be removed from this course. Error: ", error);
    }
}

function hideRemoveProposedBookModal() {
    const modal = document.getElementById("delete-modal");
    modal.style.display = "none";
}

function showRemoveProposedBookModal(){
    const modal = document.getElementById("delete-modal");
    modal.style.display = "flex";
}

function addEventListenerToRemoveProposedBookModalButtons() {
    let confirmBtn = document.getElementById("confirm_remove");
    let cancelBtn = document.getElementById("cancel_remove");
    confirmBtn.addEventListener("click", async function(event){
        event.preventDefault();
        await deleteProposedBook();
        // location.reload();
    });
    cancelBtn.onclick = (event) => {
        event.preventDefault();
        hideRemoveProposedBookModal();
    };
}

function setEventListenerOnSearchBar() {
    document.getElementById("search_input").addEventListener("input", function () {
        let filter = this.value.toLowerCase();
        let books = document.querySelectorAll("#books_list li");
        books.forEach((book) => {
            let courseName = book.getAttribute("data-name").toLowerCase();
            let courseCode = book.getAttribute("data-code").toLowerCase();
    
            if (courseName.includes(filter) || courseCode.includes(filter)) {
                book.style.display = "";
            } else {
                book.style.display = "none";
            }
        });
    });
}

function resetFilter() {
    document.getElementById("search_input").value = "";
    let courses = document.querySelectorAll("#books_list li");
    courses.forEach((course) => {
        course.style.display = "";
    });
}

function addEventListenerToRemoveBtns(){
    // Add a click event listener on all the "Remove Book" buttons
    document.querySelectorAll(".remove_book_btn").forEach( button => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const confirmBtn = document.getElementById("confirm_remove");
            confirmBtn.setAttribute("data-id", id);
            showRemoveProposedBookModal();
        });
    });
}

document.addEventListener("DOMContentLoaded", async function(){
    await getProposedBooks();
    addEventListenerToRemoveBtns();
    addEventListenerToRemoveProposedBookModalButtons();
    setEventListenerOnSearchBar(); 
});


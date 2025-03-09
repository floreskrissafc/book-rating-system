const deleteBtn = document.getElementById("delete_btn");
const deleteModal = document.getElementById("delete-modal");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const updateBookBtn = document.getElementById("submit_btn");
const messageContainer = document.getElementById("message_container");
const message = document.getElementById("message");
let bookTitle;


// Function to populate the form fields in the edit_book_page
function populateForm(data) {
    document.getElementById("ISBN_input").value = data.ISBN;
    document.getElementById("book_title_input").value = data.title;
    bookTitle = data.title;
    document.getElementById("author_input").value = data.authors;
    document.getElementById("edition_input").value = data.edition;
    document.getElementById("online_library_link_input").value = data.link;
    document.getElementById("current_book_img").src = "../" + data.cover_picture;
}

async function fetchBook(book_id) {
    // This function will query the database and get all the books 
    try {
        const response = await fetch(`http://localhost:3000/books/byid/${book_id}`, { 
            method: "GET", 
        });
        if ( response.ok ){
            const data = await response.json();
            populateForm(data);  
        }
    } catch (error) {
        console.error("Error fetching book list:", error);
    }
}

async function deleteBook(book_id){
    try {
        const response = await fetch("http://localhost:3000/books", { 
            method: "DELETE", // Making a DELETE request to delete the book
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ book_id }) 
        });
        if (response.ok) {
            alert(`Book "${bookTitle}" was deleted`);
            window.location.href = "/pages/books_page.html";
        } else {
            message.textContent = "The book could not be deleted.";
            messageContainer.style.display = "flex";
            deleteModal.style.display = "none";
        } 
    } catch (error){
        console.log("There was an error trying to delete the course: ", error);
    }
}

async function updateBook(book_id){
    // if the user clicks the Update Book button then a POST request must be sent to
    // update the book's data in the DB
    try { 
        const isbn = document.getElementById("ISBN_input").value;
        const title = document.getElementById("book_title_input").value;
        const authors = document.getElementById("author_input").value;
        const book_pic_input = document.getElementById("book_pic_input").files[0];
        const edition = document.getElementById("edition_input").value;
        const link = document.getElementById("online_library_link_input").value;
        let formData = new FormData();
        formData.append('id', book_id);
        formData.append('isbn', isbn);
        formData.append('title', title);
        formData.append('authors', authors);
        formData.append('edition', edition);
        formData.append('link', link);
        formData.append('book_pic_input', book_pic_input);
        const response = await fetch("http://localhost:3000/books/update", { 
            method: "POST", // Making a POST request to update the book
            body: formData,
        });
        if (response.ok) {
            console.log(`Book ${title} was updated.`);
            alert("The book was updated with new information!");
            window.location.href = `./books_page.html`;
        } else {
            const data = await response.json();
            console.log("There was an error trying to update the book:", data);
            alert(`The book could not be updated. Error: ${data.error}`);
        }
    } catch (error) {
        console.error("Error while trying to create a book: ", error);
    }  
}

document.addEventListener("DOMContentLoaded", async function(){
    const urlParams = new URLSearchParams(window.location.search);
    const bookId =  urlParams.get("bookId");
    await fetchBook(bookId);

    deleteBtn.addEventListener("click", (event) => {
        event.preventDefault(); 
        deleteModal.style.display = "flex";
    });
    
    cancelDeleteBtn.addEventListener("click", (event) => {
        event.preventDefault(); 
        deleteModal.style.display = "none";
    });

    confirmDeleteBtn.addEventListener("click", (event)=> {
        event.preventDefault();
        deleteBook(bookId);
    });

    updateBookBtn.addEventListener("click", (event)=> {
        event.preventDefault();
        updateBook(bookId);
    });

});

// add book is the same that the edit_profile
const form = document.getElementById("add_book_form");

async function saveBook(){
    // if the user clicks the Save button then a POST request must be sent to
    // save the book's data in the DB
    const messageContainer = document.getElementById("message_container");
    const message = document.getElementById("message");
    try { 
        const isbn = document.getElementById("ISBN_input").value;
        const title = document.getElementById("book_title_input").value;
        const authors = document.getElementById("author_input").value;
        const book_pic_input = document.getElementById("book_pic_input").files[0];
        const edition = document.getElementById("edition_input").value;
        const link = document.getElementById("online_library_link_input").value;
        let formData = new FormData();
        formData.append('isbn', isbn);
        formData.append('title', title);
        formData.append('authors', authors);
        formData.append('edition', edition);
        formData.append('link', link);
        formData.append('book_pic_input', book_pic_input);
        const response = await fetch("http://localhost:3000/books", { 
            method: "POST", // Making a POST request to save the book
            body: formData,
        });
        if (response.ok) {
            console.log(`Book ${title} was added.`);
            message.textContent = "The book was added to the system";
            messageContainer.style.display = "flex";
            form.reset();
        } else {
            const data = await response.json();
            console.log("There was an error trying to save the book:", data);
            console.log("data: \n", data);
            alert(`The book could not be added to the course. Error: ${data.error}`);
        }
    } catch (error) {
        console.error("Error while trying to create a book: ", error);
    }
}

document.addEventListener("DOMContentLoaded", () => { 
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        saveBook();
    });

    document.getElementById("book_pic_input").addEventListener("change", function (event) {
        event.preventDefault();
        const file = this.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            alert("File size must be under 5MB!");
            this.value = ""; // Clearing the file input
        }
    });   
});
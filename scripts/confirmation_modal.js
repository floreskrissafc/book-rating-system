const deleteBtn = document.getElementById("delete_btn");
const deleteModal = document.getElementById("delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");

deleteBtn.addEventListener("click", (event) => {
    console.log("delete button was clicked");
    event.preventDefault(); // Preventing the button from submitting the form
    deleteModal.style.display = "flex";
});

cancelDeleteBtn.addEventListener("click", () => {
    console.log("cancel delete was called");
    event.preventDefault(); // Preventing the button from submitting the form
    deleteModal.style.display = "none";
});

confirmDeleteBtn.addEventListener("click", () => {
    console.log("confirm delete was clicked");
    event.preventDefault(); // Preventing the button from submitting the form
    deleteBook();
    deleteModal.style.display = "none";
});

// Function to delete the book (example API call)
function deleteBook() {
    alert("Book was deleted");
    //const bookId = document.getElementById("bookISBN").value; // Get book ID
    //fetch(`/api/books/${bookId}`, {
    //    method: "DELETE",
    //})
    //.then(response => {
    //    if (!response.ok) throw new Error("Failed to delete book");
    //    alert("Book deleted successfully.");
    //    window.location.href = "/books"; // Redirect after deletion
    //})
    //.catch(error => console.error("Error deleting book:", error));
}

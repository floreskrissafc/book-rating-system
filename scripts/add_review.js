// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        bookId: params.get("bookId"),
        bookName: params.get("bookName"),
        userId: params.get("userId"),
        userStatus: params.get("userStatus") // this should be 1 or 2, 1 for admins
    };
}

// Extracting the id and name of the book from the url
//const { id: bookId, name: bookName } = getQueryParams();  // must uncomment this line

// placeholder values for now
const bookId = 1;
const bookName = "The Sutle Art of Programming";
const userId = 2;
const userStatus = 2;

// Creating a global variable so it can be used later
window.currentBookId = bookId;
window.currentUserId = userId;
window.currentUserStatus = userStatus;
window.currentBookName = bookName;

// Inserting the book name into the title container
document.getElementById("book_title_h2").textContent = `${bookName} Reviews`;
document.querySelector("title").textContent = `Reviews for ${bookName}`; //
document.getElementById("modal_title").textContent = `${bookName}`;

function addReview() {
    // Function to be called when user clicks the "Add Review" button
    console.log("Adding review for book ID:", window.currentBookId);

    // Open the modal
    //document.getElementById("review_modal").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("add_review_btn").addEventListener("click", addReview);
});

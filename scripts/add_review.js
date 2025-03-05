function getQueryParameter(parameterName) {
    // Function to get a query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

function addReview() {
    // Function to be called when user clicks the "Add Review" button
    console.log("Adding review for book ID:", window.currentBookId);

    // Open the modal
    //document.getElementById("review_modal").style.display = "block";
}

async function fetchBook(book_id) {
    // This function will query the database and get all the books 
    try {
        const response = await fetch(`http://localhost:3000/books/${book_id}`, { 
            method: "GET", 
        });
        if ( response.ok ){
            const data = await response.json();
            window.currentBookId = data.id;
            window.currentBookName = data.title; 
            window.isAdmin = response.headers.get("IS-ADMIN") == "1" ? true : false ;
        }
    } catch (error) {
        console.error("Error fetching book list:", error);
    }
}
function renderBookInfo() {
    // Inserting the book name into the title container
    document.getElementById("book_title_h2").textContent = `${window.currentBookName} Reviews`;
    document.querySelector("title").textContent = `Reviews for ${window.currentBookName}`; //
    document.getElementById("modal_title").textContent = `${window.currentBookName}`;

    if (window.isAdmin) {
        // TODO: use similar logic as in list_reviews_for_book.js 's setupDeleteModal and setupEditModal.
        // document.getElementById("add_review_btn").hidden = true;
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    let bookId = getQueryParameter("bookId");
    await fetchBook(bookId);
    renderBookInfo();
    document.getElementById("add_review_btn").addEventListener("click", addReview);
});

// Function to populate the form fields in the edit_book_page
function populateForm(data) {
    document.getElementById("ISBN_input").value = data.ISBN;
    document.getElementById("book_title_input").value = data.title;
    document.getElementById("author_input").value = data.authors;
    document.getElementById("edition_input").value = data.edition;
    document.getElementById("online_library_link_input").value = data.link;
    document.getElementById("current_book_img").src = "../" + data.cover_picture;
}

async function fetchBook(book_id) {
    // This function will query the database and get all the books 
    try {
        const response = await fetch(`http://localhost:3000/books/${book_id}`, { 
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

document.addEventListener("DOMContentLoaded", async function(){
    const urlParams = new URLSearchParams(window.location.search);
    const bookId =  urlParams.get("bookId");
    await fetchBook(bookId);
});

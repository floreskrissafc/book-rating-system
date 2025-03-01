// Function to populate the form fields in the edit_book_page
function populateForm(data) {
    document.getElementById("ISBN_input").value = data.bookISBN;
    document.getElementById("book_title_input").value = data.book_title;
    document.getElementById("author_input").value = data.authors;
    document.getElementById("edition_input").value = data.edition;
    document.getElementById("online_library_link_input").value = data.book_link;
    document.getElementById("current_book_img").src = data.book_img;
}

// Simulated JSON response from the database
const bookData = {
    bookISBN: "978-3-16-148410-0",
    book_title: "Introduction to Algorithms",
    authors: "Thomas H. Cormen, Charles E. Leiserson",
    edition: 3,
    book_link: "https://example.com/book-details",
    book_img: "../imgs/books_cover/default_book_cover.png"
};

async function fetchAndPopulateBook(bookId) {
    try {
        //const response = await fetch(`/api/books/${bookId}`);  // Replace with your actual API endpoint
        //if (!response.ok) throw new Error("Failed to fetch book data");

        //const data = await response.json();
        const data = bookData;
        populateForm(data);
    } catch (error) {
        console.error("Error fetching book details:", error);
    }
}

// Example: Fetch book with ID 123
fetchAndPopulateBook(123);

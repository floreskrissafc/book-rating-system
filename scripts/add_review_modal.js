function submitReview() {
    alert("Review was submited");
    // TODO
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

document.addEventListener("DOMContentLoaded", function () {
    // Function to handle the creation of a new review for a book
    // It handles the star rating functionality and the submission of the review

    const addReviewBtn = document.getElementById("add_review_btn");
    const addReviewModal = document.getElementById("add_review-modal");
    const submitReviewBtn = document.getElementById("submit_review");
    const cancelReviewBtn = document.getElementById("cancel_review");
    const stars = document.querySelectorAll("#new_review_star_rating i");
    const ratingDisplay = document.getElementById("selected_rating");
    const reviewForm = document.getElementById("new_review_form");
    let selectedRating = 1; // Default rating is 1 star

    addReviewBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Preventing the button from submitting the form
        addReviewModal.style.display = "flex";
    });

    submitReviewBtn.addEventListener("click", () => {
        event.preventDefault(); // Preventing the button from submitting the form
        submitReview();
        addReviewModal.style.display = "none";
    });

    cancelReviewBtn.addEventListener("click", () => {
        console.log("cancel review was called");
        event.preventDefault(); // Preventing the button from submitting the form
        reviewForm.reset(); // Reset the form fields
        updateStars(1); // Reset the stars to default 1 star
        addReviewModal.style.display = "none";
    });

    function updateStars(rating) {
        // Function that updates the stars visually by changing their class
        stars.forEach((star) => {
            const starValue = parseInt(star.getAttribute("data-value"));
            star.classList.toggle("filled", starValue <= rating);
        });
        ratingDisplay.textContent = rating;
    }

    updateStars(selectedRating); // Set default rating to 1 on page load

    stars.forEach((star) => {
        //on hover call the updateStars function
        star.addEventListener("mouseover", function () {
            updateStars(parseInt(this.getAttribute("data-value")));
        });

        // on click, the rating must be final
        star.addEventListener("click", function () {
            selectedRating = parseInt(this.getAttribute("data-value"));
            updateStars(selectedRating);
        });
    });

    document.getElementById("new_review_star_rating").addEventListener("mouseleave", function () {
        updateStars(selectedRating); // Restore to selected rating when mouse leaves the star
    });
});

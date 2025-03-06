export async function submitEditReview(newReview) {
    alert("Edit review was submited");
    //TODO: implement the real submission of the form to the backend

    const response = await fetch("http://localhost:3000/reviews/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newReview)
    });

    const data = await response.json();
    if (response.ok) {
        console.log('review edit succesfully');
    } else {
        alert(`Error updating review: ${data.error}`);
    }
}

export async function fillEditForm(review) {
    // Function to handle the editing of a review for a book
    // It handles the star rating functionality and the submission of the review
    const editReviewModal = document.getElementById(`edit_review_modal-${review.user_id}-${review.book_id}`);
    const submitEditReviewBtn = document.getElementById("submit_edit_review");
    const cancelEditReviewBtn = document.getElementById("cancel_edit_review");
    const editStars = document.querySelectorAll("#edit_review_star_rating i");
    const editRatingDisplay = document.getElementById("edit_review_selected_rating");
    const editComment = document.getElementById("edit_review_textarea");
    const editReviewForm = document.getElementById("edit_review_form");
    let selectedRating = review.rating;
    function updateEditedStars(new_rating) {
        // Function that updates the stars visually by changing their class
        editStars.forEach((star) => {
            const starValue = parseInt(star.getAttribute("data-value"));
            star.classList.toggle("filled", starValue <= new_rating);
        });
        editRatingDisplay.textContent = new_rating;
    }

    submitEditReviewBtn.addEventListener("click", async () => {
        console.log("submit edited review was clicked");
        event.preventDefault(); // Preventing the button from submitting the form
        const newReview = {
            user_id: review.user_id,
            book_id: review.book_id,
        };
        if (editComment) {
            newReview['comment'] = editComment.value;
        }
        if (editRatingDisplay) {
            newReview['rating'] = editRatingDisplay.textContent;
        }
        await submitEditReview(newReview);
        // TODO: figure how to refesh the data after success submit.
        editReviewModal.style.display = "none";
    });

    cancelEditReviewBtn.addEventListener("click", () => {
        console.log("cancel edit review was called");
        event.preventDefault(); // Preventing the button from submitting the form
        editReviewForm.reset(); // Reset the form fields
        updateEditedStars(review.rating);
        editReviewModal.style.display = "none";
    });

    updateEditedStars(selectedRating);

    editStars.forEach((star) => {
        //on hover call the updateStars function
        star.addEventListener("mouseover", function () {
            updateEditedStars(parseInt(this.getAttribute("data-value")));
        });

        // on click, the rating must be final
        star.addEventListener("click", function () {
            selectedRating = parseInt(this.getAttribute("data-value"));
            updateEditedStars(selectedRating);
        });
    });

    document.getElementById("edit_review_star_rating").addEventListener("mouseleave", function () {
        updateEditedStars(selectedRating); // Restore to selected rating when mouse leaves the star
    });
}

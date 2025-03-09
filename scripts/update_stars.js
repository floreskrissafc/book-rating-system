let selectedRating = 1;

export function updateStars(rating) {
    const stars = document.querySelectorAll("#new_review_star_rating i");
    const ratingDisplay = document.getElementById("selected_rating");
    // Function that updates the stars visually by changing their class
    stars.forEach((star) => {
        const starValue = parseInt(star.getAttribute("data-value"));
        star.classList.toggle("filled", starValue <= rating);
    });
    ratingDisplay.textContent = rating;
}

export function addEventListenersToStars(){
    const stars = document.querySelectorAll("#new_review_star_rating i");
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
}

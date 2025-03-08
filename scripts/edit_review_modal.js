export async function submitEditReview() {
    try {
        let comment = document.getElementById("edit_review_textarea").value;
        let rating = document.getElementById("edit_review_selected_rating").textContent;
        let book_id = document.getElementById("submit_edit_review").getAttribute("data-bookId");
        let user_id = document.getElementById("submit_edit_review").getAttribute("data-userId");
        const response = await fetch("http://localhost:3000/reviews/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({book_id, user_id, comment, rating})
        });
        const data = await response.json();
        if (response.ok) {
            alert("Your review was updated!");
            location.reload();
        } else {
            alert(`There was an error updating the review: ${data.error}`);
        }
    } catch (error) {
        console.log("There was an error trying to edit this review. Error: ", error);
    }   
}

// Create functionality to submit a review 

export async function submitNewBookReview(rating, user_id, book_id, comment, book_title){
    try {
        let response = await fetch("http://localhost:3000/reviews", { 
            method: "POST", // Making a POST request to save a new review for a book
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ book_id, user_id, rating, comment }) 
        });
        if ( response.ok ){
            alert(`Your review for ${book_title} was successfully added to the system!`);
        } else {
            const data = await response.json();
            console.log("There was an error trying to submit the review:", data);
            alert(`The review for this book could not be created. Error: ${data.error}`);
        }
    } catch (error){
        console.log("There was an error trying to submit the review: ", error);
    }
}

export async function getUserInfo() {
    try {
        const response = await fetch("http://localhost:3000/user", { method: "GET"}); // get the information for the logged in user
        if (response.ok) {
            const data = await response.json(); 
            return data;
        } 
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}



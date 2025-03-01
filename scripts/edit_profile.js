// Function to populate the form fields in the profile_page
function populateForm(data) {
    document.getElementById("name_input").value = data.name;
    document.getElementById("last_name_input").value = data.lastname;
    document.getElementById("current_profile_img").src = data.profile_pic;
}

// Simulated JSON response from the database
const userData = {
    name: "Joe",
    lastname: "Doe",
    profile_pic: "../imgs/user_profiles/default_profile.png"
};

async function fetchAndPopulateUser(userId) {
    try {
        //const response = await fetch(`/api/books/${bookId}`);  // Replace with your actual API endpoint
        //if (!response.ok) throw new Error("Failed to fetch book data");

        //const data = await response.json();
        const data = userData;
        populateForm(data);
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}

// Example: Fetch book with ID 123
fetchAndPopulateUser(123);

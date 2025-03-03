import { updatePassword, validateNewPassword, validatePasswordMatch } from "./change_password.js";

let userEmail;

function populateForm(data) {
    // Function to populate the form fields in the profile_page
    document.getElementById("name_input").value = data.first_name;
    document.getElementById("last_name_input").value = data.last_name;
    document.getElementById("current_profile_img").src = "../" + data.profile_picture;
}

async function updateProfile(){
    // If the users clicks update profile button, a request must be sent to update their information on the DB
    const updateMessageContainer = document.getElementById("update_message_container");
    const updateMessage = document.getElementById("update_message").textContent;
    try { 
        const first_name = document.getElementById("name_input").value;
        const last_name = document.getElementById("last_name_input").value;
        const profile_picture = document.getElementById("profile_pic_input").files[0];
        let formData = new FormData();
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('profile_pic_input', profile_picture);
        const response = await fetch("http://localhost:3000/users/update", { 
            method: "POST", // Making a POST request to update the user
            body: formData,
        });
        if (response.ok) {
            alert("User was updated");
            updateMessage.textContent = "Profile information was updated!";
            updateMessageContainer.style.display = "flex";
            console.log("calling the fetchAndPopulateUser after an update");
            fetchAndPopulateUser();
        } else {
            console.log("Error while updating the user");
        }
    } catch (error) {
        updateMessage.textContent = 'Profile could not be updated';
        updateMessageContainer.style.display = "flex";
        console.error("Error fetching user details:", error);
    }
}

async function fetchAndPopulateUser() {
    try {
        console.log("Calling the fetchAndPopulateUser function");
        const response = await fetch("http://localhost:3000/user", { method: "GET"}); // get the information for the logged in user
        if (response.ok) {
            const data = await response.json(); // Converting the response of type ReadableStream into a JSON
            userEmail = data.email;
            populateForm(data);
        } 
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => { 
    fetchAndPopulateUser();
    document.getElementById("new_password").addEventListener("input", validateNewPassword);
    document.getElementById("new_password_repeat").addEventListener("input", validatePasswordMatch);
    document.getElementById("update_profile_form").addEventListener("submit", updateProfile);
    document.getElementById("change_password_form").addEventListener("submit", function (event) {
        event.preventDefault();
        updatePassword(userEmail);
    });
});


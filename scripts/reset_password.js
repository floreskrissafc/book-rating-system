import {validateNewPassword, validatePasswordMatch } from "./change_password.js" ;


function getQueryParameter(parameterName) {
    // Function to get a query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

export async function sendResetPassword() {
    try {
            // event.preventDefault();
            const updateMessageContainer = document.getElementById("update_password_message_container");
            const updateMessage = document.getElementById("update_password_message");
            console.log("forgot password to hit");
            let token = getQueryParameter("token");
            let newPassword = document.getElementById("new_password").value;
            const response = await fetch(`http://localhost:3000/users/resetpassword/${token}`, {
                method: "POST", // Making a POST request to create the user
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newPassword }) 
            });
        
            const body = await response.json();
            if (response.ok) {
                updateMessage.textContent = "Password was updated!";
                updateMessageContainer.style.display = "flex";
                console.log(`response: ${JSON.stringify(body, null, 4)}`);
            } else {
                console.log(`Error: ${JSON.stringify(body, null, 4)}`);
                updateMessage.textContent = `There was an error trying to update the password. Error: ${body.error}`;
                updateMessageContainer.style.display = "flex";
            }
            
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    document.body.style.visibility = "visible";
    document.getElementById("new_password").addEventListener("input", validateNewPassword);
    document.getElementById("new_password_repeat").addEventListener("input", validatePasswordMatch);
    var form = document.getElementById("reset_password_form");
    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        sendResetPassword();
    } );
});
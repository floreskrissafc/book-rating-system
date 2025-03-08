const currentPasswordInput = document.getElementById("current_password");
const newPasswordInput = document.getElementById("new_password");
const newPasswordRepeatInput = document.getElementById("new_password_repeat");
const messageContainer = document.getElementById("update_password_message_container");
const message = document.getElementById("update_password_message");

function checkPasswordStrength(password) {
    // Function to check the password's strength
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

export function validateNewPassword() {
    // Function to change the style of the input field to show up red until the password is strong enough
    const newPassword = newPasswordInput.value;
    if (!newPassword) {
        newPasswordInput.style.backgroundColor = "white";
    } else if (!checkPasswordStrength(newPassword)) {
        // until the password is strong enough, show a light red background color on the input field
        newPasswordInput.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
    } else {
        // once the password is strong enough, show a green margin on the input field
        newPasswordInput.style.border = "2px solid green";
        newPasswordInput.style.backgroundColor = "white";
    }
}

export function validatePasswordMatch() {
    // Function that checks whether the new passwords match
    if (newPasswordInput.value !== newPasswordRepeatInput.value) {
        // until the passwords match, show a light red background color on the input field
        newPasswordRepeatInput.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        message.textContent = "Passwords do not match.";
        messageContainer.style.display = "block";
    } else {
        // once the passwords match show a green margin on the input field
        newPasswordRepeatInput.style.border = "2px solid green";
        newPasswordRepeatInput.style.backgroundColor = "white";
        messageContainer.style.display = "none";
    }
}

export async function updatePassword(email) {
    const oldPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const newPasswordRepeat = newPasswordRepeatInput.value;
    if (!checkPasswordStrength(newPassword)) {
        message.textContent = "New password must be at least 8 characters, include a number and a special character.";
        messageContainer.style.display = "flex";
        return;
    }
    if (newPassword !== newPasswordRepeat) {
        message.textContent = "Passwords do not match.";
        messageContainer.style.display = "flex";
        return;
    }
    try {
        const response = await fetch("http://localhost:3000/users/changepassword", { 
            method: "POST", // Making a POST request to create the user
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, oldPassword, newPassword }) 
        });
        if (response.ok) {
            document.getElementById("change_password_form").reset();
            newPasswordRepeatInput.style.border = "none";
            newPasswordInput.style.border = "none";
            message.textContent = "Password was updated";
            messageContainer.style.display = "flex";
        }
    } catch (error) {
        message.textContent = 'Password could not be updated';
        messageContainer.style.display = "flex";
        console.error("Error updating password:", error);
    }
}


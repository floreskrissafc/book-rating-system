document.addEventListener("DOMContentLoaded", function () {
    const currentPasswordInput = document.getElementById("current_password");
    const newPasswordInput = document.getElementById("new_password");
    const newPasswordRepeatInput = document.getElementById("new_password_repeat");
    const errorMessage = document.getElementById("error_message");
    const successMessage = document.getElementById("success_message");
    const form = document.getElementById("change_password_form");

    // Function to check the password's strength
    function checkPasswordStrength(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    function validateNewPassword() {
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

    function validatePasswordMatch() {
        if (newPasswordInput.value !== newPasswordRepeatInput.value) {
            // until the passwords match, show a light red background color on the input field
            newPasswordRepeatInput.style.backgroundColor = "rgba(255, 0, 0, 0.2)";

            errorMessage.textContent = "Passwords do not match.";
            errorMessage.style.display = "block";
        } else {
            // once the passwords match show a green margin on the input field
            newPasswordRepeatInput.style.border = "2px solid green";
            newPasswordRepeatInput.style.backgroundColor = "white";
            errorMessage.style.display = "none";
        }
    }

    // Add the event listeners to the passwords fields to validate the password strength and matching of the repeat
    newPasswordInput.addEventListener("input", validateNewPassword);
    newPasswordRepeatInput.addEventListener("input", validatePasswordMatch);

    // Handle form submission
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const newPasswordRepeat = newPasswordRepeatInput.value;

        if (!checkPasswordStrength(newPassword)) {
            errorMessage.textContent =
                "Password must be at least 8 characters, include a number and a special character.";
            errorMessage.style.display = "block";
            return;
        }

        if (newPassword !== newPasswordRepeat) {
            errorMessage.textContent = "Passwords do not match.";
            errorMessage.style.display = "block";
            return;
        }

        // Sending data to the DB for storage
        //try {
        //    const response = await fetch("/change-password", {
        //        method: "POST",
        //        headers: { "Content-Type": "application/json" },
        //        body: JSON.stringify({ currentPassword, newPassword })
        //    });
        //
        //    const result = await response.json();
        //    if (response.ok) {
        //        successMessage.textContent = "Password updated successfully!";
        //        successMessage.style.display = "block";
        //        errorMessage.style.display = "none";
        //        newPasswordInput.style.backgroundColor = "";
        //        newPasswordRepeatInput.style.border = "";
        //    } else {
        //        errorMessage.textContent = result.message;
        //        errorMessage.style.display = "block";
        //        successMessage.style.display = "none";
        //    }
        //} catch (error) {
        //    errorMessage.textContent = "An error occurred. Please try again.";
        //    errorMessage.style.display = "block";
        //}
    });
});

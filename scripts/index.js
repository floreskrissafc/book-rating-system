export function toggleLogIn() {
    document.getElementById("sign_up_form_container").classList.add("hidden");
    document.getElementById("log_in_form_container").classList.remove("hidden");
}

export function toggleSignUp() {
    document.getElementById("sign_up_form_container").classList.remove("hidden");
    document.getElementById("log_in_form_container").classList.add("hidden");
}

// Attach event listeners when the page loads
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("toggle_to_logIn").addEventListener("click", toggleLogIn);
    document.getElementById("toggle_to_signUp").addEventListener("click", toggleSignUp);
});

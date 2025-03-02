export function toggleLogIn() {
    document.getElementById("sign_up_form_container").classList.add("hidden");
    document.getElementById("log_in_form_container").classList.remove("hidden");
}

export function toggleSignUp() {
    document.getElementById("sign_up_form_container").classList.remove("hidden");
    document.getElementById("log_in_form_container").classList.add("hidden");
}

async function logIn(event,email,password,screenSize){
    try {
        const response = await fetch("http://localhost:3000/users/login", { 
            method: "POST", // Making a POST request to log in the user
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }) // Send the information username & password to log in
        });

        if (response.ok) {
            // If the user already exists and the log in succeded then redirect the user to the courses page
            window.location.href = "/pages/courses_page.html";
        } else {
            // The user could not be logged in because the credentials are invalid
            let errorMessageDiv = null;
            let errorMessageP = null;
            if ( screenSize == 1){ // The the login submitted came from a big screen
                errorMessageDiv = document.getElementById("login_error_container_form1");
                errorMessageP = document.getElementById("login_error_message_form1");
            } else {
                errorMessageDiv = document.getElementById("log_in_error");
                // eslint-disable-next-line no-undef
                errorMessageP = document.getElementById("log_in_error_message");
            }
            const data = await response.json();
            const errorMessage = data.error;
            errorMessageP.textContent = errorMessage;
            errorMessageDiv.style.display = "flex";
            console.log(data.error);
        }
    } catch (error) {
        console.error("Error logging in:", error);
    }
}

function getLogInDataBigScreen(event){
    event.preventDefault();
    const email = document.getElementById("email_form1").value;
    const password = document.getElementById("password_form1").value; 
    logIn(event,email,password,1);
}

function getLogInDataSmallScreen(event) {
    event.preventDefault();
    const email = document.getElementById("email_form_login").value;
    const password = document.getElementById("password_form_login").value; 
    logIn(event,email,password,2);
}

async function signUp(event){
    event.preventDefault();
    try {
        const first_name = document.getElementById("inputName2").value;
        const last_name = document.getElementById("inputLastName2").value;
        const email = document.getElementById("email_form2").value;
        const password = document.getElementById("password_form2").value;
        const response = await fetch("http://localhost:3000/users/register", { 
            method: "POST", // Making a POST request to create the user
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ first_name, last_name, email, password }) 
        });
        if (response.ok) {
            // If the user was created, the system can log them in immediately 
            await logIn(null, email, password);
            
        } else {
            // The user could not be created and the system must show the error to the user 
            const errorMessageDiv = document.getElementById("sign_up_error");
            const errorMessageP = document.getElementById("sign_up_error_message");
            const data = await response.json();
            const errorMessage = data.error;
            errorMessageP.textContent = errorMessage;
            errorMessageDiv.style.display = "block";
            console.log(data.error);
        }
    } catch (error){
        console.error("Error Signing up:", error);
    }
}

// Attach event listeners when the page loads
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("toggle_to_logIn").addEventListener("click", toggleLogIn);
    document.getElementById("toggle_to_signUp").addEventListener("click", toggleSignUp);
    document.getElementById("form_inline").addEventListener("submit", getLogInDataBigScreen);
    document.getElementById("log_in_small").addEventListener("submit", getLogInDataSmallScreen);
    document.getElementById("signUp_form").addEventListener("submit", signUp);
});

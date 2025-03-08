export async function sendForgotPasswordEmail(event) {
    try {
            event.preventDefault();
            document.getElementById("message_container").style.display = "flex";
            console.log("forgot password to hit");
            let email = document.getElementById("email").value;
            const response = await fetch("http://localhost:3000/users/forgotpassword", {
                method: "POST", // Making a POST request to create the user
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email }) 
            });
        
            const body = await response.json();
            if (response.ok) {
                console.log(`response: ${JSON.stringify(body, null, 4)}`);
            } else {
                console.log(`Error: ${JSON.stringify(body, null, 4)}`);
            }
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    document.body.style.visibility = "visible";
    var form = document.getElementById("reset_password_form");
    form.addEventListener("submit", sendForgotPasswordEmail);
});
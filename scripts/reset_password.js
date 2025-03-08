function getQueryParameter(parameterName) {
    // Function to get a query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

export async function sendResetPassword(event) {
    try {
            event.preventDefault();
            console.log("forgot password to hit");
            let token = getQueryParameter("token");
            let newPassword = document.getElementById("newpassword").value;
            const response = await fetch(`http://localhost:3000/users/resetpassword/${token}`, {
                method: "POST", // Making a POST request to create the user
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newPassword }) 
            });
        
            const body = await response.json();
            if (response.ok) {
                console.log(`response: ${JSON.stringify(body, null, 4)}`);
            } else {
                console.log(`Error: ${JSON.stringify(body, null, 4)}`);
                document.getElementById("message_container").textContent = body.error;
            }
            document.getElementById("message_container").style.display = "flex";
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    document.body.style.visibility = "visible";
    var form = document.getElementById("reset_password_form");
    form.addEventListener("submit", sendResetPassword);
});
async function logOut(){
    // Make a request to log out from the system
    try {
        const response = await fetch("http://localhost:3000/users/logout", { method: "GET" });
        if (response.ok) {
            // The user was successfully logged out, redirect them to the log in page
            window.location.href = "../index.html";
        } 
    } catch (error) {
        console.error("Error logging out:", error);
    }

}
async function loadNavBar() {
    try {
        const navContainer = document.getElementById("myTopnav");
        const response = await fetch("/templates/nav_template.hbs");
        const templateText = await response.text();
        const template = Handlebars.compile(templateText);
        navContainer.innerHTML = template();
        document.body.style.visibility = "visible";
        document.getElementById("log_out_btn").addEventListener("click", logOut);
    } catch (error) {
        console.error("Error loading navbar:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadNavBar);

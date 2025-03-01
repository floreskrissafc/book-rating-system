document.addEventListener("DOMContentLoaded", function () {
    fetch("../templates/nav_template.hbs")
        .then((response) => response.text())
        .then((templateText) => {
            const template = Handlebars.compile(templateText);
            document.getElementById("myTopnav").innerHTML = template();
            document.body.style.visibility = "visible";
        })
        .catch((error) => console.error("Error loading navbar:", error));
});

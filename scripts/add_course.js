async function createModule() {
    const form = document.getElementById("add_course_form");
    const module_code = document.getElementById("course_code_input").value;
    const name = document.getElementById("course_name_input").value;
    const message_container = document.getElementById("message_container");
    const message = document.getElementById("message");
    try {
        const response = await fetch("http://localhost:3000/modules", { 
            method: "POST", // Making a POST request to create the new module
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ module_code, name }) 
        });
        if (response.ok) {
            // If the module was created, let the user know 
            form.reset();
            message.textContent = `The module ${name} was created successfully`;
            message_container.style.display = "flex";

        }
    } catch (error){
        console.log(`There was an error when trying to create the module ${name}`, error);
        message.textContent = "Profile information was updated!";
        message_container.style.display = "flex";
    }
    
}

document.addEventListener("DOMContentLoaded", () => { 
    document.getElementById("add_course_form").addEventListener("submit", function(event) {
        event.preventDefault();
        createModule();
    });
});
async function loadTemplate(courses) {
    try {
        // Fetching the course_dropdown template
        const templateResponse = await fetch("/templates/course_dropdown.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const html = template({ courses }); // Generating the actual HTML
        document.getElementById("courses_container").innerHTML = html; // Inserting the html into the page that required it
    } catch (error) {
        console.error("Error loading template for courses' list:", error);
    }
}

async function loadCourses() {
    try {
        const response = await fetch("http://localhost:3000/modules", { 
            method: "GET", // Get the list of courses already in the database
        });
        if ( !response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const isAdminStr = response.headers.get("IS-ADMIN");
        const isAdmin = isAdminStr == "1" ? true : false;
        window.currentUserStatus = isAdmin;
        const data = await response.json(); // Converting the response of type ReadableStream into a JSON
        const courses = data.data;
        await loadTemplate(courses); 
    } catch (error) {
        console.error("Error fetching course list:", error);
    }
}

// Must load all the courses when the page loads
document.addEventListener("DOMContentLoaded", async function(){
    await loadCourses();
});
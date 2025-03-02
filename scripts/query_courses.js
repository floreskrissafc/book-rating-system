async function loadTemplate(courses) {
    try {
        // Fetching the courses template
        const templateResponse = await fetch("/templates/courses_list.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const html = template({ courses }); // Generating the actual HTML
        document.getElementById("courses_list").innerHTML = html; // Inserting the html into the page that required it
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
        const data = await response.json(); // Converting the response of type ReadableStream into a JSON
        const courses = data.data;
        loadTemplate(courses);
        
    } catch (error) {
        console.error("Error fetching course list:", error);
    }
}

// Must load all the courses when the page loads
document.addEventListener("DOMContentLoaded", loadCourses);

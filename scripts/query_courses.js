async function loadTemplate(courses, isAdmin) {
    try {
        // Fetching the courses template
        const templateResponse = await fetch("/templates/courses_list.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);
        const html = template({ courses, isAdmin }); // Generating the actual HTML
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
        const isAdminStr = response.headers.get("IS-ADMIN");
        const isAdmin = isAdminStr == "1" ? true : false;
        window.currentUserStatus = isAdmin;
        const data = await response.json(); // Converting the response of type ReadableStream into a JSON
        const courses = data.data;
        await loadTemplate(courses, isAdmin); 
    } catch (error) {
        console.error("Error fetching course list:", error);
    }
}

// Must load all the courses when the page loads
document.addEventListener("DOMContentLoaded", async function(){
    await loadCourses();
    // Add an event listener to all the buttons "See course" so that they can redirect
    // to the course page for their particular course
    document.querySelectorAll(".see_course_btn").forEach( button => {
        button.addEventListener("click", function () {
            const courseId = this.getAttribute("data_module_id");
            const courseCode = this.getAttribute("data_module_code");
            const courseName = this.getAttribute("data_module_name");
            if (courseId && courseCode && courseName) {
                // redirectioning with url parameters to later perform a GET request
                window.location.href = `./course_page.html?courseId=${courseId}&courseName=${courseName}&courseCode=${courseCode}`;
            }
        });
    });
    document.querySelectorAll(".edit_course_btn").forEach( button => {
        button.addEventListener("click", function () {
            const courseId = this.getAttribute("data_module_id");
            const courseCode = this.getAttribute("data_module_code");
            const courseName = this.getAttribute("data_module_name");
            if (courseId && courseCode && courseName) {
                // redirectioning with url parameters to later perform a GET request
                window.location.href = `./edit_course_page.html?courseId=${courseId}&courseName=${courseName}&courseCode=${courseCode}`;
            }
        });
    });

});

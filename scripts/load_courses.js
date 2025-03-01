async function loadCourses() {
    try {
        // Fetching the courses template
        const templateResponse = await fetch("/templates/course_dropdown.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);

        // Fetching the courses data from the server
        //const response = await fetch("/api/courses");

        //const courses = await response.json();

        const courses = [
            { courseId: "CM2020", courseName: "Algorithms" },
            { courseId: "CM2021", courseName: "Discrete Mathematics" },
            { courseId: "CM2022", courseName: "Web Development" },
            { courseId: "CM2023", courseName: "Agile Software Dev" }
        ];

        // Generating the actual HTML
        const html = template({ courses });

        // Inserting the html into the page that required it
        document.getElementById("courses_container").innerHTML = html;
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}

// Must load all the courses when the page loads
document.addEventListener("DOMContentLoaded", loadCourses);

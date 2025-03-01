async function loadCourses() {
    try {
        // Fetching the courses template
        const templateResponse = await fetch("/templates/courses_list.hbs");
        const templateText = await templateResponse.text();
        const template = Handlebars.compile(templateText);

        // Fetching the courses data from the server
        //const response = await fetch("/api/courses");

        //const courses = await response.json();

        const courses = [
            { id: 1, courseCode: "CM2020", courseName: "Algorithms" },
            { id: 2, courseCode: "CM2021", courseName: "Discrete Mathematics" },
            { id: 3, courseCode: "CM2022", courseName: "Web Development" },
            { id: 4, courseCode: "CM2023", courseName: "Agile Software Dev" }
        ];

        // Generating the actual HTML
        const html = template({ courses });

        // Inserting the html into the page that required it
        document.getElementById("courses_list").innerHTML = html;
    } catch (error) {
        console.error("Error loading courses' list:", error);
    }
}

// Must load all the courses when the page loads
document.addEventListener("DOMContentLoaded", loadCourses);

function getBooksForCourse(courseCode) {
    // This function should query the database and get the books
    // already associated with this course
    console.log("function getBooksForCourse was called for courseCode = ", courseCode);
}

document.getElementById("search_input").addEventListener("input", function () {
    let filter = this.value.toLowerCase();
    let courses = document.querySelectorAll("#course_list li");

    courses.forEach((course) => {
        let name = course.getAttribute("data-name").toLowerCase();
        let code = course.getAttribute("data-code").toLowerCase();

        if (name.includes(filter) || code.includes(filter)) {
            course.style.display = "";
        } else {
            course.style.display = "none";
        }
    });
});

function resetFilter() {
    let filter = (document.getElementById("search_input").value = "");
    let courses = document.querySelectorAll("#course_list li");
    courses.forEach((course) => {
        course.style.display = "";
    });
}

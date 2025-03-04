// async function loadBooksTemplate(books) {
//     try {
//         // Fetching the books template
//         const templateResponse = await fetch("/templates/books_list.hbs");
//         const templateText = await templateResponse.text();
//         const template = Handlebars.compile(templateText);
//         const html = template({ books }); // Generating the actual HTML
//         // document.getElementById("courses_list").innerHTML = html; // Inserting the html into the page that required it
//     } catch (error) {
//         // console.error("Error loading template for courses' list:", error);
//     }
// }



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


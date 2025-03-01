// Function to populate the form fields in the edit_course_page
function populateForm(data) {
    document.getElementById("course_code_input").value = data.course_code;
    document.getElementById("course_name_input").value = data.course_name;
}

// Simulated JSON response from the database
const courseData = {
    course_code: "CM3456",
    course_name: "Intro to Logic"
};

async function fetchAndPopulateCourse(courseId) {
    try {
        //const response = await fetch(`/api/books/${bookId}`);  // Replace with your actual API endpoint
        //if (!response.ok) throw new Error("Failed to fetch book data");

        //const data = await response.json();
        const data = courseData;
        populateForm(data);
    } catch (error) {
        console.error("Error fetching book details:", error);
    }
}

fetchAndPopulateCourse(123);

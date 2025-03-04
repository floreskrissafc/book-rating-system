const deleteBtn = document.getElementById("delete_btn");
const deleteModal = document.getElementById("delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const updateBtn = document.getElementById("submit_btn");
const messageContainer = document.getElementById("message_container");
const message = document.getElementById("message");

// Function to populate the form fields in the edit_course_page
function populateForm() {
    document.getElementById("course_code_input").value = window.currentCourseCode;
    document.getElementById("course_name_input").value = window.currentCourseName;
}

function getQueryParameter(parameterName) {
    // Function to get a query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}
function getUrlData() {
    window.currentCourseId = getQueryParameter("courseId");
    window.currentCourseCode = getQueryParameter("courseCode");
    window.currentCourseName = getQueryParameter("courseName");
}

async function  updateCourse(){
    const module_id = window.currentCourseId;
    const module_name = document.getElementById("course_name_input").value;
    const module_code = document.getElementById("course_code_input").value;
    try {
        const response = await fetch("http://localhost:3000/modules/update", { 
            method: "POST", // Making a POST request to log in the user
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ module_id, module_name, module_code }) 
        });
        if (response.ok) {
            message.textContent = "The information for the course was updated!";
            messageContainer.style.display = "flex";
        } else {
            message.textContent = "The course data could not be updated. Make sure the module code is not in use by another module.";
        }
    } catch (error){
        console.log("There was an error trying to update the course, ", error);
    }
}

async function deleteCourse(){
    const module_id = window.currentCourseId;
    try {
        const response = await fetch("http://localhost:3000/modules", { 
            method: "DELETE", // Making a DELETE request to delete the module
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ module_id }) 
        });
        if (response.ok) {
            alert(`Course ${window.currentCourseName} was deleted`);
            window.location.href = "/pages/courses_page.html";
        } else {
            message.textContent = "The course could not be deleted.";
            messageContainer.style.display = "flex";
            deleteModal.style.display = "none";
        } 
    } catch (error){
        console.log("There was an error trying to update the course, ", error);
    }

}

document.addEventListener("DOMContentLoaded", function() {
    // Get the data sent through the URL
    getUrlData();
    // Update input elements in form on the page
    populateForm();
    // set event listeners on the buttons
    updateBtn.addEventListener("click", function(event) {
        event.preventDefault();
        updateCourse();
    });
    confirmDeleteBtn.addEventListener("click", function(event){
        event.preventDefault();
        deleteCourse();
    });

    deleteBtn.addEventListener("click", (event) => {
        event.preventDefault(); 
        deleteModal.style.display = "flex";
    });
    
    cancelDeleteBtn.addEventListener("click", (event) => {
        event.preventDefault(); 
        deleteModal.style.display = "none";
    });

});

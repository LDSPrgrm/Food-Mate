// Load data after the page is loaded
window.addEventListener("DOMContentLoaded", loadProducts);

const showFormButton = document.getElementById("show-form-button");
const createFormDiv = document.getElementById("create-form");

// Add a click event listener to the button
showFormButton.addEventListener("click", function() {
    
    const showFormButton = document.getElementById("show-form-button");
    const title = "Add New Viand";
    const id = document.getElementById("id");

    if(showFormButton.textContent === title) {
        const name = document.getElementById('pname');
        const description = document.getElementById('description');
        const price = document.getElementById('price');
        const stock = document.getElementById('stock');

        name.value = description.value = price.value = stock.value = '';

        document.getElementById("form-title").textContent = title;
    } else {
        const courseName = document.getElementById('cname');
        const department = document.getElementById('dept');

        id.value = courseName.value = department.value = '';
        document.getElementById("form-title").textContent = "Add New Course";
    }

    // Toggle the visibility of the form div
    if (createFormDiv.style.display === "none") {
        createFormDiv.style.display = "block";
    } else {
        createFormDiv.style.display = "none";
    }
});

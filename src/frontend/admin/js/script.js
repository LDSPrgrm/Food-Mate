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
        const id = document.getElementById('id');
        const name = document.getElementById('pname');
        const description = document.getElementById('description');
        const price = document.getElementById('price');
        const stock = document.getElementById('stock');

        id.value = name.value = description.value = price.value = stock.value = '';

        document.getElementById("form-title").textContent = title;
    } else if(showFormButton.textContent === "Add New User") {
        
        const id = document.getElementById('id');
        const role = document.getElementById('role');
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        const firstName = document.getElementById('fname');
        const middleName = document.getElementById('mname');
        const lastName = document.getElementById('lname');
        const birthdate = document.getElementById('birthdate');
        const sex = document.getElementById('sex');
        const civilStatus = document.getElementById('civil_status');
        const email = document.getElementById('email');

        id.value = role.value = username.value = password.value = 
        firstName.value = middleName.value = lastName.value = birthdate.value = 
        sex.value = civilStatus.value = email.value = '';
        document.getElementById("form-title").textContent = "Add New User";
    }

    // Toggle the visibility of the form div
    if (createFormDiv.style.display === "none") {
        createFormDiv.style.display = "block";
    } else {
        createFormDiv.style.display = "none";
    }
});

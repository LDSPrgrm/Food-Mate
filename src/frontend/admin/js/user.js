// const nameRegex = /^[a-zA-Z0-9\s]+$/; // Allows letters, numbers, and spaces for the name
// const numberRegex = /^\d+$/; // Ensures the value is a positive integer
const addNewUser = "Add New User";

function loadUsers(event) {
    event.preventDefault();
    var content = document.querySelector(".content");
    var createUser = document.getElementById("create-form");
    const showFormButton = document.getElementById("show-form-button");

    showFormButton.style.display = "block";
    showFormButton.textContent = addNewUser;
    document.querySelector("li.active").classList.remove("active");
    document.getElementById("nav-users").classList.add("active");

    fetch("/user-create")
    .then(response => response.text())
    .then(html => {
        createUser.innerHTML = html;
    })
    .catch(error => {
        console.error("Error: " + error)
    });

    fetch("/user-content")
    .then(response => response.text())
    .then(html => {
        content.innerHTML = html;
        getUsers();
    })
    .catch(error => {
        console.error("Error: " + error)
    });
}

function searchUser(event) {
    event.preventDefault();
    const table = document.querySelector("table tbody");
    const searchTerm = document.getElementById('search-input').value;

    table.innerHTML = '';

    fetch(`/user-search?q=${searchTerm}`)
    .then(response => response.json())
    .then(data => {
        var rows = 1;
        data.forEach(row => {
            refreshUsers(row, rows++);
        });
    })
    .catch(error => {
        console.error("Error: ", error);
    });
}

function saveUser(event) {
    event.preventDefault();
    const table = document.querySelector("table tbody");

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

    // Validate the input values with regex
    /*
    if (
        !nameRegex.test(name.value) ||
        !numberRegex.test(price.value) ||
        !numberRegex.test(stock.value)
    ) {
        alert("One or more input values are invalid.");
        return;
    }
    */

    fetch('user-add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            role_id: role.value,
            username: username.value,
            password: password.value,
            first_name: firstName.value,
            middle_name: middleName.value,
            last_name: lastName.value,
            birthdate: birthdate.value,
            sex: sex.value,
            civil_status: civilStatus.value,
            email: email.value,
        })
    })
    .then(response => response.json())
    .then(jsonData => {
        table.innerHTML = '';

        var rows = 1;
        jsonData.forEach(row => {
            refreshUsers(row, rows++);

            // Remove inputs from the form
            role.value = username.value = password.value = 
            firstName.value = middleName.value = lastName.value = 
            birthdate.value = sex.value = civilStatus.value = email.value = '';
        });
        document.getElementById("data-table").scrollIntoView({ behavior: 'smooth', block: 'end' });
    })
    .catch(error => {
        console.error('Error adding a new entry:', error);
        alert('Failed to add user. Username or email is already existing in the database.');
        return;
    });
}

function deleteUser(id){
    // Open a confirm dialog box to allow user to confirm deletion
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if(confirm) {
        // Get a reference to the table body
        const table = document.querySelector('#data-table tbody');
        // Perform a fetch request to delete the entry by ID
        fetch(`/user-delete?id=${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(jsonData => {
            // Clear the existing table content
            table.innerHTML = '';
            
            var rows = 1;
            jsonData.forEach(row => {
                refreshUsers(row, rows++);
            });
        })
        .catch(error => {
            console.error('Error deleting the entry:', error);
        });
    }
}

function updateUser(id){
    if (createFormDiv.style.display === "none") {
        showFormButton.click();
    } 
    
    fetch(`/user-update?id=${id}`)  //Fetch the record from the server
    .then(response => response.json())
    .then(jsonData => {
        
        // Hide and show buttons
        document.getElementById("edit-save").style.display="inline-block";
        document.getElementById("new-save").style.display="none";

        // Populate form
        document.getElementById("id").value = jsonData.user_id;
        document.getElementById("role").value = jsonData.role_id;
        document.getElementById("username").value = jsonData.username;
        document.getElementById("password").value = jsonData.password;
        document.getElementById("fname").value = jsonData.first_name;
        document.getElementById("mname").value = jsonData.middle_name;
        document.getElementById("lname").value = jsonData.last_name;
        document.getElementById("birthdate").value = jsonData.birthdate;
        document.getElementById("sex").value = jsonData.sex;
        document.getElementById("civil_status").value = jsonData.civil_status;
        document.getElementById("email").value = jsonData.email;

        document.getElementById("create-form").scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById("form-title").textContent = "Update User | ID: " + jsonData.user_id;
    })
    .catch(error =>{
        console.error('Error fetching data:', error);
    });
}

function updateSaveUser(event){
    event.preventDefault();

    const id = document.getElementById("id");
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

    /*
    if (
        !nameRegex.test(name.value) ||
        !numberRegex.test(price.value) ||
        !numberRegex.test(stock.value)
    ) {
        alert("One or more input values are invalid.");
        return;
    }
    */
    
    // Get a reference to the table body
    const tableBody = document.querySelector('#data-table tbody');

    // Send a POST request to save record changes
    fetch('/user-update-save', {      //create a server route/context for this
        method: 'PUT',           //PUT request method is used for update
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: id.value,
            role_id: role.value,
            username: username.value,
            password: password.value,
            first_name: firstName.value,
            middle_name: middleName.value,
            last_name: lastName.value,
            birthdate: birthdate.value,
            sex: sex.value,
            civil_status: civilStatus.value,
            email: email.value,
        })
    })
    .then(response => response.json())
    .then(jsonData => {
        // Clear the existing table content
        tableBody.innerHTML = '';

        var rows = 1;
        // Refresh table
        jsonData.forEach(row => {
            refreshUsers(row, rows++);
        });

        // Clear form fields
        id.value = role.value = username.value = password.value = 
        firstName.value = middleName.value = lastName.value = 
        birthdate.value = sex.value = civilStatus.value = email.value = '';
        // Hide and show buttons
        document.getElementById("edit-save").style.display="none";
        document.getElementById("new-save").style.display="inline-block";

        // Scroll into table
        document.getElementById("data-table").scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Change form tile
        document.getElementById("form-title").textContent = addNewUser;
    })
    .catch(error => {
        console.error('Error updating entry:', error);
        alert('Failed to update viand information. Viand name is already existing in the database.');
        return;
    });
    showFormButton.click();
}

function getUsers() {
    fetch(`/users`)
    .then(response => response.json())
    .then(data => {
        var rows = 1;
        data.forEach(row => {
            refreshUsers(row, rows++);
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}

function refreshUsers(row, rows) {
    const table = document.querySelector("table tbody");
    // Create a new blank tr element
    const tr = document.createElement("tr");

    // Create a td for my ID
    const tdID = document.createElement("td");
    tdID.textContent = rows;

    const tdRole = document.createElement("td");
    if (row.role_id === 1) {
        tdRole.textContent = "Admin";
    } else {
        tdRole.textContent = "Client";
    }

    const tdUsername = document.createElement("td");
    tdUsername.textContent = row.username;
    
    const tdPassword = document.createElement("td");
    tdPassword.textContent = row.password;

    const tdFirstName = document.createElement("td");
    tdFirstName.textContent = row.first_name;

    const tdMiddleName = document.createElement("td");
    tdMiddleName.textContent = row.middle_name;

    const tdLastName = document.createElement("td");
    tdLastName.textContent = row.last_name;

    const tdBirthdate = document.createElement("td");
    tdBirthdate.textContent = row.birthdate;

    const tdSex = document.createElement("td");
    tdSex.textContent = row.sex;

    const tdCivilStatus = document.createElement("td");
    tdCivilStatus.textContent = row.civil_status;

    const tdEmail = document.createElement("td");
    tdEmail.textContent = row.email;

    const tdAction = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener('click', () => deleteUser(row.user_id));

    // Create "Update" button
    const updateButton = document.createElement('button');
    updateButton.classList.add("update-button");
    updateButton.textContent = "Update";
    updateButton.addEventListener('click', () => updateUser(row.user_id)); // Call update function with the ID

    tdAction.appendChild(updateButton);
    tdAction.appendChild(deleteButton);

    // Adding all td as children to tr
    // tr.appendChild(tdID);
    tr.appendChild(tdRole);
    tr.appendChild(tdUsername);
    tr.appendChild(tdFirstName);
    tr.appendChild(tdMiddleName);
    tr.appendChild(tdLastName);
    tr.appendChild(tdBirthdate);
    tr.appendChild(tdSex);
    tr.appendChild(tdCivilStatus);
    tr.appendChild(tdEmail);
    tr.appendChild(tdAction)

    // Add this tr to the table
    table.appendChild(tr);
}

function cancelUserUpdate(event) {
    event.preventDefault();

    const id = document.getElementById("id");
    const name = document.getElementById('pname');
    const description = document.getElementById('description');
    const price = document.getElementById('price');
    const stock = document.getElementById('stock');

    id.value = name.value = description.value = price.value = stock.value = '';
    
    document.getElementById("form-title").textContent = "Add New Student";

    if (createFormDiv.style.display === "block") {
        showFormButton.click();
    }
}
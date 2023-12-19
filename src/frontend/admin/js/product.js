const nameRegex = /^[a-zA-Z0-9\s]+$/; // Allows letters, numbers, and spaces for the name
const numberRegex = /^\d+$/; // Ensures the value is a positive integer
const addNewViand = "Add New Viand";

function loadProducts(event) {
    event.preventDefault();
    var content = document.querySelector(".content");
    var createProduct = document.getElementById("create-form");
    const showFormButton = document.getElementById("show-form-button");

    showFormButton.style.display = "block";
    showFormButton.textContent = addNewViand;
    document.querySelector("li.active").classList.remove("active");
    document.getElementById("nav-products").classList.add("active");

    fetch("/product-create")
    .then(response => response.text())
    .then(html => {
        createProduct.innerHTML = html;
    })
    .catch(error => {
        console.error("Error: " + error)
    });

    fetch("/product-content")
    .then(response => response.text())
    .then(html => {
        content.innerHTML = html;
        getProducts();
    })
    .catch(error => {
        console.error("Error: " + error)
    });
}

function searchProduct(event) {
    event.preventDefault();
    const table = document.querySelector("table tbody");
    const searchTerm = document.getElementById('search-input').value;

    table.innerHTML = '';

    fetch(`/product-search?q=${searchTerm}`)
    .then(response => response.json())
    .then(data => {
        var rows = 1;
        data.forEach(row => {
            refreshProducts(row, rows++);
        });
    })
    .catch(error => {
        console.error("Error: ", error);
    });
}

function saveProduct(event) {
    event.preventDefault();
    const table = document.querySelector("table tbody");

    const name = document.getElementById('pname');
    const description = document.getElementById('description');
    const price = document.getElementById('price');
    const stock = document.getElementById('stock');

    // Validate the input values with regex
    if (
        !nameRegex.test(name.value) ||
        !numberRegex.test(price.value) ||
        !numberRegex.test(stock.value)
    ) {
        alert("One or more input values are invalid.");
        return;
    }
    

    fetch('product-add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name.value,
            description: description.value,
            price: price.value,
            stock: stock.value,
            status_id: 2,
            type_id: 2,
        })
    })
    .then(response => response.json())
    .then(jsonData => {
        table.innerHTML = '';

        var rows = 1;
        jsonData.forEach(row => {
            refreshProducts(row, rows++);

            // Remove inputs from the form
            name.value = description.value = price.value = stock.value = '';
        });
        document.getElementById("data-table").scrollIntoView({ behavior: 'smooth', block: 'end' });
    })
    .catch(error => {
        console.error('Error adding a new entry:', error);
        alert('Failed to add viand. Viand name is already existing in the database.');
        return;
    });
}

function deleteProduct(id){
    // Open a confirm dialog box to allow user to confirm deletion
    const confirm = window.confirm('Are you sure you want to delete this record?');
    if(confirm) {
        // Get a reference to the table body
        const table = document.querySelector('#data-table tbody');
        // Perform a fetch request to delete the entry by ID
        fetch(`/product-delete?id=${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(jsonData => {
            // Clear the existing table content
            table.innerHTML = '';
            
            var rows = 1;
            jsonData.forEach(row => {
                refreshProducts(row, rows++);
            });
        })
        .catch(error => {
            console.error('Error deleting the entry:', error);
        });
    }
}

function updateProduct(id){
    if (createFormDiv.style.display === "none") {
        showFormButton.click();
    } 
    
    fetch(`/product-update?id=${id}`)  //Fetch the record from the server
    .then(response => response.json())
    .then(jsonData => {
        
        // Hide and show buttons
        document.getElementById("edit-save").style.display="inline-block";
        document.getElementById("new-save").style.display="none";

        // Populate form
        document.getElementById("id").value = jsonData.product_id;
        document.getElementById("pname").value = jsonData.name;
        document.getElementById("description").value = jsonData.description;
        document.getElementById("price").value = jsonData.price;
        document.getElementById("stock").value = jsonData.stock;

        document.getElementById("create-form").scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById("form-title").textContent = "Update Product | ID: " + jsonData.product_id;
    })
    .catch(error =>{
        console.error('Error fetching data:', error);
    });
}

function updateSaveProduct(event){
    event.preventDefault();

    const id = document.getElementById("id");
    const name = document.getElementById('pname');
    const description = document.getElementById('description');
    const price = document.getElementById('price');
    const stock = document.getElementById('stock');

    if (
        !nameRegex.test(name.value) ||
        !numberRegex.test(price.value) ||
        !numberRegex.test(stock.value)
    ) {
        alert("One or more input values are invalid.");
        return;
    }
    
    // Get a reference to the table body
    const tableBody = document.querySelector('#data-table tbody');

    // Send a POST request to save record changes
    fetch('/product-update-save', {      //create a server route/context for this
        method: 'PUT',           //PUT request method is used for update
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            product_id: id.value,
            name: name.value,
            description: description.value,
            price: price.value,
            stock: stock.value,
            status_id: 2,
            type_id: 2,
        })
    })
    .then(response => response.json())
    .then(jsonData => {
        // Clear the existing table content
        tableBody.innerHTML = '';

        var rows = 1;
        // Refresh table
        jsonData.forEach(row => {
            refreshProducts(row, rows++);
        });

        // Clear form fields
        id.value = name.value = description.value = price.value = stock.value = '';

        // Hide and show buttons
        document.getElementById("edit-save").style.display="none";
        document.getElementById("new-save").style.display="inline-block";

        // Scroll into table
        document.getElementById("data-table").scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Change form tile
        document.getElementById("form-title").textContent = addNewViand;
    })
    .catch(error => {
        console.error('Error updating entry:', error);
        alert('Failed to update viand information. Viand name is already existing in the database.');
        return;
    });
    showFormButton.click();
}

function toggleStatus(productId) {
    const confirm = window.confirm('Are you sure you want to update the availability status of this viand?');
    if(confirm) {
    // Fetch the current status of the product
    fetch(`/product-status?id=${productId}`)
        .then(response => response.json())
        .then(product => {
            // Determine the new status
            const newStatusId = (product.status_id === 1) ? 2 : 1; // Assuming 1 for "Available", 2 for "Unavailable"

            // Perform a fetch request to update the product status
            fetch(`/product-toggle-status?id=${productId}&status=${newStatusId}`, {
                method: 'PUT',
            })
            .then(response => response.json())
            .then(updatedProduct => {
                // If successful, update the UI based on the new status
                updateStatusUI(productId, newStatusId);
            })
            .catch(error => {
                console.error('Error updating status:', error);
            });
        })
        .catch(error => {
            console.error('Error fetching current status:', error);
        });
    } else {
        return;
    }
}

function updateStatusUI(productId, newStatusId) {
    const statusButton = document.getElementById(`status-button-${productId}`);

    if (statusButton) {
        statusButton.textContent = (newStatusId === 1) ? 'Available' : 'Unavailable';
        statusButton.classList.remove((newStatusId === 1) ? "unavailable" : "available");
        statusButton.classList.add((newStatusId === 1) ? "available" : "unavailable");
        // statusButton.style.backgroundColor = (newStatusId === 1) ? '#086f5a' : '#d81a1a';
    }
}

function getProducts() {
    fetch(`/products`)
    .then(response => response.json())
    .then(data => {
        var rows = 1;
        data.forEach(row => {
            refreshProducts(row, rows++);
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}

function refreshProducts(row, rows) {
    const table = document.querySelector("table tbody");
    // Create a new blank tr element
    const tr = document.createElement("tr");

    // Create a td for my ID
    const tdID = document.createElement("td");
    tdID.textContent = rows;

    // Create a name for first name
    const tdName = document.createElement("td");
    tdName.textContent = row.name;

    const tdDescription = document.createElement("td");
    tdDescription.textContent = row.description;

    const tdPrice = document.createElement("td");
    tdPrice.textContent = "₱ " + row.price.toFixed(2);

    const tdStock = document.createElement("td");
    tdStock.textContent = row.stock;

    const tdTotalPrice = document.createElement("td");
    tdTotalPrice.textContent = "₱ " + (row.price * row.stock).toFixed(2);

    const statusButton = document.createElement('button');
    statusButton.classList.add("status-button");
    statusButton.id = `status-button-${row.product_id}`;
    statusButton.textContent = (row.status_id === 1) ? 'Available' : 'Unavailable';
    statusButton.addEventListener('click', () => toggleStatus(row.product_id));

    const tdStatus = document.createElement('td');
    tdStatus.classList.add("product-status");
    tdStatus.appendChild(statusButton);

    const tdAction = document.createElement('td');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener('click', () => deleteProduct(row.product_id));

    // Create "Update" button
    const updateButton = document.createElement('button');
    updateButton.classList.add("update-button");
    updateButton.textContent = "Update";
    updateButton.addEventListener('click', () => updateProduct(row.product_id)); // Call update function with the ID

    tdAction.appendChild(updateButton);
    tdAction.appendChild(deleteButton);

    // Adding all td as children to tr
    // tr.appendChild(tdID);
    tr.appendChild(tdName);
    tr.appendChild(tdDescription);
    tr.appendChild(tdPrice);
    tr.appendChild(tdStock);
    tr.appendChild(tdTotalPrice);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAction);

    // Add this tr to the table
    table.appendChild(tr);
}

function cancelProductUpdate(event) {
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
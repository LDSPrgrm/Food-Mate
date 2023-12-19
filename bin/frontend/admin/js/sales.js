function loadSales(event) {
    event.preventDefault();
    var content = document.querySelector(".content");
    const showFormButton = document.getElementById("show-form-button");

    showFormButton.style.display = "none";
    document.querySelector("li.active").classList.remove("active");
    document.getElementById("nav-sales").classList.add("active");

    fetch("/sales-content")
    .then(response => response.text())
    .then(html => {
        content.innerHTML = html;
        getSales();
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
            refreshSales(row, rows++);
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
            refreshSales(row, rows++);

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
                refreshSales(row, rows++);
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
            refreshSales(row, rows++);
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

function getSales() {
    fetch(`/sales`)
    .then(response => response.json())
    .then(data => {
        var rows = 1;
        data.forEach(row => {
            refreshSales(row, rows++);
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}

function refreshSales(row, rows) {
    const table = document.querySelector("table tbody");
    // Create a new blank tr element
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = row.name;

    const tdQuantity = document.createElement("td");
    tdQuantity.textContent = row.total_sales_quantity;

    const tdTotalSales = document.createElement("td");
    tdTotalSales.textContent = "₱ " + (row.total_sales_amount).toFixed(2);
    
    // Adding all td as children to tr
    tr.appendChild(tdName);
    tr.appendChild(tdQuantity);
    tr.appendChild(tdTotalSales);

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
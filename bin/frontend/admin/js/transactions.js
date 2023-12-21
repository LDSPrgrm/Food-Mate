function loadTransactions() {
    const content = document.querySelector(".content");
    const showFormButton = document.getElementById("show-form-button");

    showFormButton.style.display = "none";
    document.querySelector("li.active").classList.remove("active");
    document.getElementById("nav-transactions").classList.add("active");

    fetch("/transactions-content")
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            getTransactions();
        })
        .catch(error => {
            console.error("Error: " + error);
        });
}

function getTransactions() {
    fetch("/transactions")
        .then(response => response.json())
        .then(data => {
            data.forEach(row => {
                refreshTransactions(row);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function refreshTransactions(row) {
    const table = document.querySelector("table tbody");

    const tr = document.createElement("tr");
    
    const tdUsername = document.createElement("td");
    tdUsername.textContent = row.username;

    const tdViandNames = document.createElement("td");
    tdViandNames.textContent = row.product_names; // Access the product_names field

    const tdTotalQuantity = document.createElement("td");
    tdTotalQuantity.textContent = row.total_quantity;

    const tdTotalSubtotal = document.createElement("td");
    tdTotalSubtotal.textContent = "₱ " + parseFloat(row.total_subtotal).toFixed(2);

    const tdOrderDate = document.createElement("td");
    tdOrderDate.textContent = row.order_date;

    tr.appendChild(tdUsername);
    tr.appendChild(tdViandNames);
    tr.appendChild(tdTotalQuantity);
    tr.appendChild(tdTotalSubtotal);
    tr.appendChild(tdOrderDate);

    table.appendChild(tr);
}

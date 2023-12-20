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
    tdTotalSales.textContent = "₱ " + parseFloat((row.total_sales_amount)).toFixed(2);
    
    // Adding all td as children to tr
    tr.appendChild(tdName);
    tr.appendChild(tdQuantity);
    tr.appendChild(tdTotalSales);

    // Add this tr to the table
    table.appendChild(tr);
}

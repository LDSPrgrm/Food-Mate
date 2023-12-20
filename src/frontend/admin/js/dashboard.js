function loadDashboard(event) {
    event.preventDefault();
    var content = document.querySelector(".content");
    const showFormButton = document.getElementById("show-form-button");

    showFormButton.style.display = "none"
    document.querySelector("li.active").classList.remove("active");
    document.getElementById("nav-dashboard").classList.add("active");

    fetch("/dashboard")
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            fetchDataAndUpdateDashboard();
        })
        .catch(error => {
            console.error("Error: " + error)
        });
}

function fetchDataAndUpdateDashboard() {
    // Use fetch API to get data from the Java backend
    fetch('/dashboard-stats') // Adjust the URL based on your backend API
        .then(response => response.json())
        .then(data => {
            // Update user statistics
            console.log(data);
            document.getElementById('totalUsers').textContent = data.userStatistics.totalUsers;
            document.getElementById('adminCount').textContent = data.userStatistics.adminCount;
            document.getElementById('clientCount').textContent = data.userStatistics.clientCount;

            // Update product statistics
            document.getElementById('totalProducts').textContent = data.productStatistics.totalProducts;
            document.getElementById('topSellingProductAmount').textContent = data.productStatistics.topSellingProductAmount;
            document.getElementById('topSellingProductQuantity').textContent = data.productStatistics.topSellingProductQuantity;
            document.getElementById('lowStockCount').textContent = data.productStatistics.lowStockCount;

            document.getElementById('totalSalesAmount').textContent = "₱ " + data.salesStatistics.totalSalesAmount.toFixed(2);
            document.getElementById('totalSalesQuantity').textContent = data.salesStatistics.totalSalesQuantity;
            document.getElementById('topCustomer').textContent = data.salesStatistics.topCustomer;
            document.getElementById('topCustomerTotalSpent').textContent = "₱ " + data.salesStatistics.topCustomerTotalSpent;

            // Update sales chart if needed
            // You can add logic to update the sales chart based on data.salesChartData
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

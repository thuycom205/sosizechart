// Function to initialize the size chart modal interactions
function initSizeChart() {
    var modal = document.getElementById("sizeChartModal");
    var btn = document.getElementById("sizeChartBtn");
    var span = document.getElementsByClassName("sizeChartModal-close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

// Function to fetch and render the size chart from the API
function fetchSizeChart() {
    var productId = document.querySelector('p[data-product-id]').getAttribute('data-product-id');

    fetch(`https://lara.com/api/sizechart/get_for_frontend?shop=${window.Shopify.shop}&product_id=${productId}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data && data.sizechart) {
                renderSizeChart(data.sizechart);
            } else {
                renderDefaultSizeChart();
            }
        })
        .catch(error => {
            console.error('Error fetching size chart:', error);
            renderDefaultSizeChart();
        });
}

// Function to render the size chart with the provided data
function renderSizeChart(sizechart) {
    var tableHTML = '<table class="sizeChart-table"><tbody>';
    sizechart.sizechart_data.forEach(row => {
        tableHTML += '<tr>';
        row.forEach(value => {
            tableHTML += `<td>${value}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';

    if (sizechart.image_url) {
        tableHTML += `<img src="${sizechart.image_url}" alt="Size Chart" class="sizechart-image">`;
    }

    document.getElementById('size-chart-container').innerHTML = tableHTML;
}

// Function to render a default size chart if no specific chart is available
function renderDefaultSizeChart() {
    // Define a default size chart structure here...
    // The structure should be similar to the one expected from the API
    var defaultSizeChart = {...}; // Replace with default data

    renderSizeChart(defaultSizeChart);
}

// Call the functions to fetch and display the size chart
fetchSizeChart();
initSizeChart();

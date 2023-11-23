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

    fetch(`https://xapp.thexseed.com/api/sizechart/get_for_frontend?shop=${window.Shopify.shop}&product_id=${productId}`)
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
    var defaultSizeChart = {
        "success": true,
        "sizechart": {
            "id": 1,
            "sizechart_data": [
                ["Size", "S", "M", "L", "XL"],
                ["EU Size", "46", "50", "54", "58"],
                ["US Size", "36", "40", "44", "48"],
                ["Chest (in)", "34-36", "38-40", "42-44", "46-48"],
                ["Waist (in)", "28-30", "32-34", "36-38", "40-42"]
            ],
            "image_url": "http://example.com/path/to/sizechart-image.jpg",
            "shop_name": "Example Shop",
            "created_at": "2021-01-01T00:00:00Z",
            "updated_at": "2021-01-01T00:00:00Z",
            "is_default_sizechart": 1,
            "title": "Default Men's T-Shirts Size Chart"
        }
    }; // Replace with default data

    renderSizeChart(defaultSizeChart);
}


document.addEventListener('DOMContentLoaded', function() {
    // Initialize size chart modal and fetch size chart data
    initSizeChart();
    fetchSizeChart();
});

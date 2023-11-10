console.log(window.Shopify.shop);
var pElement = document.getElementById('sizechartproductid');

// To get the value of 'theId' attribute
var theIdValue = pElement.getAttribute('data-product-id');
console.log(theIdValue);

function initSizeChart() {
  var sizeChart = document.getElementById('sizechartproductid');
  var sizeChartId = sizeChart.getAttribute('data-theProductId');
    // Get the modal
    var modal = document.getElementById("sizeChartModal");

    // Get the button that opens the modal
    var btn = document.getElementById("sizeChartBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("sizeChartModal-close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
function fetchSizeChart() {
    var productId = document.querySelector('p[data-product-id]').getAttribute('data-product-id');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://lara.com/api/sizechart/get?shop=' + window.Shopify.shop + '&product_id=' + productId, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 && xhr.responseText) {
                var response = JSON.parse(xhr.responseText);
                if (response && response.sizechart_data) {
                    renderSizeChart(response.sizechart_data);
                } else {
                    renderDefaultSizeChart();
                }
            } else {
                renderDefaultSizeChart();
            }
        }
    };

    xhr.send();
}

// Function to render the size chart table with the provided data
function renderSizeChart(sizeChart) {
    // Start with the opening tags for the table and tbody
    var tableHTML = '<table class="sizeChart-table"><tbody>';

    // Loop over each row in the size chart data
    sizeChart.forEach(function (row) {
        tableHTML += '<tr>';
        // Loop over each cell in the row
        Object.entries(row).forEach(function ([key, value]) {
            // Add a th for the header cell, or a td for data cells
            var cellTag = key === 'header' ? 'th' : 'td';
            tableHTML += `<${cellTag}>${value}</${cellTag}>`;
        });
        tableHTML += '</tr>';
    });

    // Close the tbody and table tags
    tableHTML += '</tbody></table>';

    // Insert the table into the DOM - for example, into a div with the ID 'size-chart-container'
    document.getElementById('size-chart-container').innerHTML = tableHTML;
}
function renderDefaultSizeChart() {
    var defaultSizeChart = [
        {
            header: 'Size',
            XS: 'XS',
            S: 'S',
            M: 'M',
            L: 'L',
            // Add more sizes as needed
        },
        {
            header: 'EU Size',
            XS: '34',
            S: '36',
            M: '38',
            L: '40',
            // Add more EU sizes as needed
        },
        {
            header: 'US Size',
            XS: '2',
            S: '4',
            M: '6',
            L: '8',
            // Add more US sizes as needed
        },
        {
            header: 'Chest (in)',
            XS: '32-34',
            S: '34-36',
            M: '36-38',
            L: '38-40',
            // Add more chest measurements as needed
        },
        {
            header: 'Waist (in)',
            XS: '24-26',
            S: '26-28',
            M: '28-30',
            L: '30-32',
            // Add more waist measurements as needed
        },
        {
            header: 'Hips (in)',
            XS: '34-36',
            S: '36-38',
            M: '38-40',
            L: '40-42',
            // Add more hip measurements as needed
        },
        // Add more rows for other measurements as needed
    ];

    renderSizeChart(defaultSizeChart);
}

// Call the function to fetch and render the size chart
fetchSizeChart();

initSizeChart();

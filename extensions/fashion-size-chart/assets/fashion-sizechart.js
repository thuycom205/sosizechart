// Function to initialize the size chart modal interactions
document.addEventListener('DOMContentLoaded', function() {
    createSizeChartButton();
    initSizeChart();
    fetchSizeChart();
});

function createSizeChartButton() {

    // Create a new div to act as the button
    var btnDiv = document.createElement('div');
    btnDiv.className = 'sizeChartBtn';
    btnDiv.style = 'background: rgb(255, 255, 255); border-color: rgb(0, 0, 0); border-radius: 11px 11px 0px 0px; fill: rgb(35, 35, 35); width: 101px; height: 35px; position: fixed; right: 10px; top: 50%; transform: translateY(-50%) rotate(0deg); z-index: 1000; cursor: pointer; display: flex; align-items: center; justify-content: center;';

// Create the SVG element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.innerHTML = '<path d="M509.502,104.908L407.097,2.502c-3.337-3.337-8.73-3.337-12.067,0L2.502,395.03c-3.337,3.337-3.337,8.73,0,12.067 l102.405,102.405c1.596,1.604,3.772,2.5,6.033,2.5c2.261,0,4.429-0.896,6.033-2.5l392.527-392.527 c1.604-1.596,2.5-3.772,2.5-6.033C512.002,108.68,511.106,106.512,509.502,104.908z M110.941,491.402l-90.338-90.338 L401.063,20.603l90.338,90.338L110.941,491.402z"/>';
    svg.setAttribute('class', 'float-button-img avada-link-icon');
    svg.style = 'fill: rgb(35, 35, 35);';

// Create a span for the button text
    var textSpan = document.createElement('span');
    textSpan.className = 'float-button-text has-icon';
    textSpan.style = 'color: rgb(35, 35, 35);';
    textSpan.textContent = 'Size chart';

// Append the SVG and text span to the button div
    btnDiv.appendChild(svg);
    btnDiv.appendChild(textSpan);

// Append the button div to the body
    document.body.appendChild(btnDiv);


}

function initSizeChart() {
    var modal = document.getElementById("sizeChartModal");
    var btn = document.getElementById("sizeChartBtn");
    var span = document.getElementsByClassName("sizeChartModal-close")[0];

    if (modal && span) {
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
}

// ... rest of the functions (fetchSizeChart, renderSizeChart, renderDefaultSizeChart) remain unchanged


function initSizeChart() {
    var modal = document.getElementById("sizeChartModal");
    var btns = document.getElementsByClassName("sizeChartBtn");
    var span = document.getElementsByClassName("sizeChartModal-close")[0];

    // As there might be multiple buttons, add click event to all buttons
    Array.from(btns).forEach(function(btn) {
        btn.onclick = function() {
            modal.style.display = "block";
        };
    });

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
    var defaultSizeChart = [
        ["Size", "S", "M", "L", "XL"],
        ["EU Size", "46", "50", "54", "58"],
        ["US Size", "36", "40", "44", "48"],
        ["Chest (in)", "34-36", "38-40", "42-44", "46-48"],
        ["Waist (in)", "28-30", "32-34", "36-38", "40-42"]
    ]; // Replace
    renderSizeChart({
        sizechart_data: defaultSizeChart,
        image_url: ""
    });}


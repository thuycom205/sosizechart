// Function to initialize the size chart modal interactions
document.addEventListener('DOMContentLoaded', function() {
    createSizeChartButton();
    initSizeChart();
    fetchSizeChart();
});

function createSizeChartButton() {
    var btnContainer = document.createElement('div');
    btnContainer.className = 'sizeChartBtn';
    btnContainer.style.cssText = `
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        font-size: 18px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;

    var svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('class', 'IconWrapper-module--icon__1nWiK IconWrapper-module--small__ZImL2');
    svgIcon.setAttribute('viewBox', '0 0 24 24');
    svgIcon.setAttribute('focusable', 'false');
    svgIcon.innerHTML = `<path d="M24,8 L24,17 L-1.8189894e-12,17 L-1.8189894e-12,8 L24,8 Z M22,11 L21,11 L21,9 L19,9 L19,13 L18,13 L18,9 L16,9 L16,11 L15,11 L15,9 L13,9 L13,13 L12,13 L12,9 L10,9 L10,11 L9,11 L9,9 L7,9 L7,13 L6,13 L6,9 L4,9 L4,11 L3,11 L3,9 L1,9 L1,16 L23,16 L23,9 L22,9 L22,11 Z" transform="translate(12.000000, 12.500000) rotate(-45.000000) translate(-12.000000, -12.500000) "></path>`;
    svgIcon.style.height = '16px';
    svgIcon.style.transform = 'rotate(-45deg)';

    var textSpan = document.createElement('span');
    textSpan.textContent = 'Size Chart';
    textSpan.style.writingMode = 'vertical-lr';
    textSpan.style.textOrientation = 'mixed';

    btnContainer.appendChild(svgIcon);
    btnContainer.appendChild(textSpan);

    document.body.appendChild(btnContainer);
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
    var btn = document.getElementsByClassName("sizeChartBtn");
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


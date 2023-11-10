console.log(window.Shopify.shop);
var pElement = document.getElementById('sizechartproductid');

// To get the value of 'theId' attribute
var theIdValue = pElement.getAttribute('data-theProductId');
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

initSizeChart();

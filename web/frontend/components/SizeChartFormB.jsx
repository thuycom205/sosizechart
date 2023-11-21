import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
function getShopParam(queryString) {
    // Create an object to hold the query parameters
    let params = {};
    // Split the query string by the '&' character to get individual key-value pairs
    let pairs = queryString.split('&');

    // Iterate over the key-value pairs
    pairs.forEach(function(pair) {
        // Split each pair by the '=' character to separate keys and values
        pair = pair.split('=');
        // Decode URI components and add the key-value pair to the params object
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    });

    // Return the 'shop' parameter value
    return params['shop'];
}


function SizeChartFormB() {
    useEffect(() => {
        $('#myForm').on('submit', function(e) {
            e.preventDefault(); // Prevent the default form submit action
            // Here you might want to implement an AJAX request to submit the form data
            // For example, using jQuery's ajax method:
            const parentURL = document.referrer;
            const host =
                window.DEVPARAMS;

            const formData = $(this).serialize() + `&parentURL=${encodeURIComponent(host)}`;
            $.ajax({
                type: "POST",
                url: "/api/products/thuy",
                data: formData,
                success: function(response) {
                },
                error: function(error) {
                }
            });
        });
    }, []);

    return (
        <div className="container mt-5">
            <form id="myForm" action="/api/products/thuy" method="post">
                <div className="mb-3">
                    <label htmlFor="inputHeight" className="form-label">Height3</label>
                    <input type="text" className="form-control" id="inputHeight" name="height" placeholder="Enter height"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputChest" className="form-label">Chest/Bust</label>
                    <input type="text" className="form-control" id="inputChest" name="chestBust" placeholder="Enter chest/bust measurement"/>
                </div>
                {/* Add more form fields with their respective 'name' attributes here */}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default SizeChartFormB;

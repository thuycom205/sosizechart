<?php
// Product ID for which you want to retrieve the metafield
$productId = 6999290970279;

// Replace with your actual shop domain and access token
$shopDomain  ='hanetest2.myshopify.com';
$accessToken = 'shpua_eef2f61be1c481ff40d02fee45732b84';

// The URL for the metafield GET API call
//$apiUrl = "https://{$shopDomain}/admin/api/2021-10/custom_collections.json?product_id={$productId}";
$apiUrl = "https://{$shopDomain}/admin/api/2021-10/smart_collections.json?product_id={$productId}";

// Set up the cURL session
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-Shopify-Access-Token: {$accessToken}",
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL session and capture the response
$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Check for errors and close the cURL session
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    // Success, print the response
    echo "Status Code: " . $statusCode . "\n";
    echo "Response: " . $response;
}

curl_close($ch);

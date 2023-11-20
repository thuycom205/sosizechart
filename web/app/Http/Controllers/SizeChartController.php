<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SizeChart;

class SizeChartController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request data
        $data = $request->validate([
            'sizechart_data' => 'required', // validation rules
            'image_url' => 'required|url',
            'shop_name' => 'required'
        ]);

        // Create a new size chart entry using the request data
        $sizeChart = SizeChart::create($data);

        // Redirect or return a response
        return redirect()->back()->with('success', 'Size chart saved successfully.');
    }

    public function checkProducIdBelongCatalog() {
        $shopUrl = 'yourshop.myshopify.com';
        $accessToken = 'your_access_token';
        $productId = 'product_id_you_want_to_check';
        $collectionId = 'collection_id_you_are_checking_against';

// Initialize cURL session
        $ch = curl_init();

// Set the cURL options
        curl_setopt($ch, CURLOPT_URL, "https://$shopUrl/admin/api/2021-10/products/$productId.json");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("X-Shopify-Access-Token: $accessToken"));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute cURL session and get the response
        $response = curl_exec($ch);
        curl_close($ch);

// Decode JSON response
        $product = json_decode($response, true);

// Check if there was an error
        if (isset($product['errors']) || curl_errno($ch)) {
            // Handle errors (e.g. product not found or API call failed)
            echo "Error: " . curl_error($ch);
            die();
        }

// Assuming the product's 'collections' field contains the IDs of collections it belongs to
        $belongs = false;
        foreach ($product['product']['collections'] as $coll) {
            if ($coll['id'] == $collectionId) {
                $belongs = true;
                break;
            }
        }

        if ($belongs) {
            echo "Product with ID $productId belongs to collection with ID $collectionId.";
        } else {
            echo "Product with ID $productId does NOT belong to collection with ID $collectionId.";
        }

    }
}

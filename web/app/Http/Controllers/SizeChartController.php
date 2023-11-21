<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SizeChart;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
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

    public function getSizeChart(Request $request)

    {
        $id = $request->input('editId');
        $id?? $id = intval($request->input('editId'));
        if ($id == 0) {
            return response()->json($this->getSampleData());
        }

        // Fetch size chart data
        $sizeChart = DB::select('SELECT * FROM sizecharts WHERE id = :id', ['id' => $id]);

        // Fetch associated rules
        $rules = DB::select('SELECT * FROM sizechart_rule WHERE sizechart_id = :id', ['id' => $id]);

        // Assuming sizechart_data and rules are stored as serialized data
        foreach ($sizeChart as &$chart) {
            $chart->sizechart_data = unserialize($chart->sizechart_data);
            $rules = $this->getRulesForSizeChart($chart->id);
            $chart->rules = $rules->rules ?? null;
            $chart->rule_id = $rules->id ?? null;


        }
        if (isset($sizeChart[0]) ) {

            return response()->json($sizeChart[0]);
        } else {
            return response()->json($this->getSampleData());
        }

    }

    public function fetchList(Request $request)

    {
        $shopName = $request->input('shop_name');
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);

        // Calculate the offset based on the current page
        $offset = ($currentPage - 1) * $itemsPerPage;

        // Get the total count of size charts for pagination
        $totalItemCount = DB::table('sizecharts')->where('shop_name', $shopName)->count();

        // Fetch size chart data with pagination
        $sizeCharts = DB::table('sizecharts')
                        ->where('shop_name', $shopName)
                        ->offset($offset)
                        ->limit($itemsPerPage)
                        ->get();

        // Fetch associated rules and unserialize data
        foreach ($sizeCharts as &$chart) {
            $chart->sizechart_data = unserialize($chart->sizechart_data);
          //  $chart->rules = $this->getRulesForSizeChart($chart->id);
        }

        return response()->json([
            'sizeCharts' => $sizeCharts,
            'totalItemCount' => $totalItemCount
        ]);
    }


    private function getRulesForSizeChart($sizechartId)
    {
        // Fetch the last size chart rule for the given sizechartId
        $rules = DB::select('SELECT * FROM sizechart_rule WHERE sizechart_id = :sizechart_id ORDER BY id DESC LIMIT 1', ['sizechart_id' => $sizechartId]);

        // Assuming there will only be one or none, so we take the first result
        $rule = $rules[0] ?? null;

        if ($rule) {
            $rule->rules = unserialize($rule->rules); // Decode JSON stored in rules column
            $rule->product_ids = unserialize($rule->product_ids); // Decode JSON stored in product_ids column
        }

        return $rule;
    }

    private function getSampleData()
    {
        return [
            "id" => 0,
            "sizechart_data" => [
                ["Size", "S", "M", "L", "XL"],
                ["EU Size", "46", "50", "54", "58"],
                ["US Size", "36", "40", "44", "48"],
                ["Chest (in)", "34-36", "38-40", "42-44", "46-48"],
                ["Waist (in)", "28-30", "32-34", "36-38", "40-42"]
            ],
            "image_url" => "http://example.com/path/to/sizechart-image.jpg",
            "shop_name" => "Example Shop",
            "created_at" => "2021-01-01T00:00:00Z",
            "updated_at" => "2021-01-01T00:00:00Z",
            "is_default_sizechart" => 0,
            "title" => "Men's T-Shirts Size Chart",
            "rule_id" => 0,
            "rules" => [
                "products" => [
                    // ... other products
                ],
                "collections" => [
                    // ... other collections
                ]
            ]
        ];
    }
    ///
    /// persistSizeChart
    ///
    public function persistSizeChart(Request $request)
    {
        $id = $request->input('editId');
        $sizechartData = $request->input('sizeChart');
        $imageUrl = $request->input('image_url' || 'https://cdn.shopify.com/s/files/1/0508/6409/1050/files/sizechart.png?v=1634260000');
        $shopName = $request->input('shop_name');
        $isDefaultSizechart = $request->input('is_default_sizechart', 0);
        $title = $request->input('title', 'Untitled');
        if ($imageUrl ===null || $imageUrl == '') $imageUrl = 'https://cdn.shopify.com/s/files/1/0508/6409/1050/files/sizechart.png?v=1634260000';
        if ($shopName ===null || $shopName == '') $shopName = 'yourshop.myshopify.com';

        try {
            DB::beginTransaction();

            if ($id == 0) {
                // Insert new sizechart record
                $id = DB::table('sizecharts')->insertGetId([
                    'sizechart_data' => serialize($sizechartData),
                    'image_url' => $imageUrl,
                    'shop_name' => $shopName,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'is_default_sizechart' => $isDefaultSizechart,
                    'title' => $title,
                ]);
            } else {
                // Update existing sizechart record
                DB::table('sizecharts')
                  ->where('id', $id)
                  ->update([
                      'sizechart_data' => serialize($sizechartData),
                      'image_url' => $imageUrl,
                      'shop_name' => $shopName,
                      'updated_at' => now(),
                      'is_default_sizechart' => $isDefaultSizechart,
                      'title' => $title,
                  ]);

                // Delete existing sizechart_rule records
                //DB::delete('DELETE FROM sizechart_rule WHERE sizechart_id = ?', [$id]);
            }
            $ruleConditions = $request->input('ruleConditions', []);

           // Initialize default values for $rule_id and $rule
            $rule_id = $ruleConditions['rule_id'] ?? 0;

            if ($rule_id == 0) {
                DB::delete('DELETE FROM sizechart_rule WHERE sizechart_id = ?', [$id]);
            }
            $rule = [
                'collections' => $ruleConditions['collections'] ?? [],
                'products' => $ruleConditions['products'] ?? [],
            ];
            // Insert sizechart_rule record if provided
            if ($ruleConditions) {
                if ($rule_id > 0) {
                    // Update existing sizechart_rule record
                    // Update existing sizechart_rule record
                    $affected = DB::table('sizechart_rule')
                                  ->where('id', $rule_id)
                                  ->update([
                                      'title' => $rule['title'] ?? 'Untitled', // Assuming title is provided in the rule, otherwise default
                                      'sizechart_id' => $id,
                                      'shop_name' => $shopName,
                                      'priority' => 1,
                                      'rules' => serialize($rule),
                                      'product_ids' => serialize($rule['product_ids'] ?? []), // Assuming product_ids is provided
                                      'updated_at' => now(),
                                  ]);
                } else {
                    // Insert new sizechart_rule record
                    $rule_id = DB::table('sizechart_rule')->insertGetId([
                        'title' => $rule['title'] ?? 'Untitled', // Assuming title is provided in the rule, otherwise default
                        'sizechart_id' => $id,
                        'shop_name' => $shopName,
                        'priority' => 1,
                        'rules' => serialize($rule),
                        'product_ids' => serialize($rule['product_ids'] ?? []), // Assuming product_ids is provided
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            DB::commit();

            return Response::json(['success' => true, 'message' => 'Size chart saved successfully.', 'id' => $id]);
        } catch (\Exception $e) {
            DB::rollBack();
            return Response::json(['success' => false, 'message' => 'Failed to save size chart.', 'error' => $e->getMessage()], 500);
        }
    }

    public function getDefaultSizeChart(Request $request)
    {
        $shopName = $request->input('shop_name');

        // Fetch the default size chart for the given shop name
        $defaultSizeChart = DB::table('sizecharts')
                              ->where('shop_name', $shopName)
                              ->where('is_default_sizechart', 1)
                              ->first();

        // Check if a default size chart exists and return it, otherwise return sample data
        if ($defaultSizeChart) {
            $defaultSizeChart->sizechart_data = unserialize($defaultSizeChart->sizechart_data);
            return response()->json($defaultSizeChart);
        } else {
            return response()->json($this->getSampleData());
        }
    }

    public function saveDefaultSizeChart(Request $request)
    {
        $request->validate([
            'sizeChart' => 'required|array',
            'title' => 'required|string',
            'shop_name' => 'required|string',
            'is_default_sizechart' => 'required|boolean',
        ]);

        $shopName = $request->input('shop_name');
        $title = $request->input('title');
        $sizeChart = serialize($request->input('sizeChart'));
        $isDefaultSizechart =1;

        try {
            // Begin transaction
            DB::beginTransaction();

            // Check if a default size chart already exists for the shop
            $existingDefaultSizeChart = DB::table('sizecharts')
                                          ->where('shop_name', $shopName)
                                          ->where('is_default_sizechart', 1)
                                          ->first();

            if ($existingDefaultSizeChart) {
                // Update the existing default size chart
                DB::table('sizecharts')
                  ->where('id', $existingDefaultSizeChart->id)
                  ->update([
                      'sizechart_data' =>$sizeChart,
                      'title' => $title,
                      'updated_at' => now(),
                  ]);
            } else {
                // No default size chart exists, insert a new one
                DB::table('sizecharts')->insert([
                    'sizechart_data' => $sizeChart,
                    'title' => $title,
                    'shop_name' => $shopName,
                    'is_default_sizechart' => 1,
                    'image_url' => 'https://cdn.shopify.com/s/files/1/0508/6409/1050/files/sizechart.png?v=1634260000', // Default image URL
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Commit transaction
            DB::commit();

            return response()->json(['success' => true, 'message' => 'Default size chart saved successfully.'], 200);
        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Failed to save default size chart.', 'error' => $e->getMessage()], 500);
        }
    }


}

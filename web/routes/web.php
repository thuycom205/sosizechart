<?php

use App\Exceptions\ShopifyProductCreatorException;
use App\Lib\AuthRedirection;
use App\Lib\EnsureBilling;
use App\Lib\ProductCreator;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Shopify\Auth\OAuth;
use Shopify\Auth\Session as AuthSession;
use Shopify\Clients\HttpHeaders;
use Shopify\Clients\Rest;
use Shopify\Context;
use Shopify\Exception\InvalidWebhookException;
use Shopify\Utils;
use Shopify\Webhooks\Registry;
use Shopify\Webhooks\Topics;
use App\Models\SizeChart;
use App\Http\Controllers\SizeChartController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
| If you are adding routes outside of the /api path, remember to also add a
| proxy rule for them in web/frontend/vite.config.js
|
*/

Route::fallback( function ( Request $request ) {
    if ( Context::$IS_EMBEDDED_APP && $request->query( "embedded", false ) === "1" ) {
        if ( env( 'APP_ENV' ) === 'production' ) {
            return file_get_contents( public_path( 'index.html' ) );
        } else {
            return file_get_contents( base_path( 'frontend/index.html' ) );
        }
    } else {
        return redirect( Utils::getEmbeddedAppUrl( $request->query( "host", null ) ) . "/" . $request->path() );
    }
} )->middleware( 'shopify.installed' );

Route::get( '/api/auth', function ( Request $request ) {
    $shop = Utils::sanitizeShopDomain( $request->query( 'shop' ) );

    // Delete any previously created OAuth sessions that were not completed (don't have an access token)
    Session::where( 'shop', $shop )->where( 'access_token', null )->delete();

    return AuthRedirection::redirect( $request );
} );

Route::get( '/api/auth/callback', function ( Request $request ) {
    $session = OAuth::callback(
        $request->cookie(),
        $request->query(),
        [ 'App\Lib\CookieHandler', 'saveShopifyCookie' ],
    );

    $host = $request->query( 'host' );
    $shop = Utils::sanitizeShopDomain( $request->query( 'shop' ) );

    $response = Registry::register( '/api/webhooks', Topics::APP_UNINSTALLED, $shop, $session->getAccessToken() );
    if ( $response->isSuccess() ) {
        Log::debug( "Registered APP_UNINSTALLED webhook for shop $shop" );
    } else {
        Log::error(
            "Failed to register APP_UNINSTALLED webhook for shop $shop with response body: " .
            print_r( $response->getBody(), true )
        );
    }

    $redirectUrl = Utils::getEmbeddedAppUrl( $host );
    if ( Config::get( 'shopify.billing.required' ) ) {
        list( $hasPayment, $confirmationUrl ) = EnsureBilling::check( $session, Config::get( 'shopify.billing' ) );

        if ( ! $hasPayment ) {
            $redirectUrl = $confirmationUrl;
        }
    }

    return redirect( $redirectUrl );
} );

Route::get( '/api/products/count', function ( Request $request ) {
    /** @var AuthSession */
    $session = $request->get( 'shopifySession' ); // Provided by the shopify.auth middleware, guaranteed to be active

    $client = new Rest( $session->getShop(), $session->getAccessToken() );
    $result = $client->get( 'products/count' );

    return response( $result->getDecodedBody() );
} )->middleware( 'shopify.auth' );

Route::get( '/api/products/create', function ( Request $request ) {
    /** @var AuthSession */
    $session = $request->get( 'shopifySession' ); // Provided by the shopify.auth middleware, guaranteed to be active

    $success = $code = $error = null;
    try {
        ProductCreator::call( $session, 5 );
        $success = true;
        $code    = 200;
        $error   = null;
    } catch ( \Exception $e ) {
        $success = false;

        if ( $e instanceof ShopifyProductCreatorException ) {
            $code  = $e->response->getStatusCode();
            $error = $e->response->getDecodedBody();
            if ( array_key_exists( "errors", $error ) ) {
                $error = $error["errors"];
            }
        } else {
            $code  = 500;
            $error = $e->getMessage();
        }

        Log::error( "Failed to create products: $error" );
    } finally {
        return response()->json( [ "success" => $success, "error" => $error ], $code );
    }
} )->middleware( 'shopify.auth' );

Route::post( '/api/webhooks', function ( Request $request ) {
    try {
        $topic = $request->header( HttpHeaders::X_SHOPIFY_TOPIC, '' );

        $response = Registry::process( $request->header(), $request->getContent() );
        if ( ! $response->isSuccess() ) {
            Log::error( "Failed to process '$topic' webhook: {$response->getErrorMessage()}" );

            return response()->json( [ 'message' => "Failed to process '$topic' webhook" ], 500 );
        }
    } catch ( InvalidWebhookException $e ) {
        Log::error( "Got invalid webhook request for topic '$topic': {$e->getMessage()}" );

        return response()->json( [ 'message' => "Got invalid webhook request for topic '$topic'" ], 401 );
    } catch ( \Exception $e ) {
        Log::error( "Got an exception when handling '$topic' webhook: {$e->getMessage()}" );

        return response()->json( [ 'message' => "Got an exception when handling '$topic' webhook" ], 500 );
    }
} );

Route::post( '/api/products/thuy', function ( Request $request ) {

    /** @var AuthSession */
    // phpinfo();
//    $des = $request->get('description');
//    echo    $des;
//    $allData = $request->all();
//    var_dump($allData);
    var_dump( $_REQUEST );
    $users = DB::select( 'select * from migrations' );

    foreach ( $users as $user ) {
        echo $user->migration;
    }
    echo "localhost";
} );
Route::get('/api/sizechart/get', function (Request $request) {
    // Retrieve 'shop' and 'session' from the query parameters
    $shop = $request->query('shop');
    $session = $request->query('session');

    // Check if 'shop' and 'session' are provided
    if ($shop ) {
        try {
            // Fetch the size chart data for the given shop
            $sizeCharts = SizeChart::where('shop_name', $shop)->orderBy('created_at', 'desc')->first();

            // Unserialize the sizechart_data for each size chart

            $sizeCharts->sizechart_data = unserialize($sizeCharts->sizechart_data);


            // Return the size chart data as a JSON response
            return response()->json($sizeCharts);
        } catch (\Exception $e) {
            // Log the exception message
            \Log::error($e->getMessage());

            // Return a JSON response with the error message and a 500 HTTP status code
            return response()->json(['error' => 'Server Error'], 500);
        }
    } else {
        // If required parameters are not provided, return an error response
        return response()->json(['error' => 'Missing parameters'], 400);
    }
});

Route::post( '/api/sizechart/save', function ( Request $request ) {

    // Get the raw POST data from the input stream
    $rawData = file_get_contents( "php://input" );

// Decode the JSON payload into an array
    $dataArray = json_decode( $rawData, true );

// Check for JSON decoding errors
    if ( json_last_error() !== JSON_ERROR_NONE ) {
        // Handle the error, maybe respond with a 400 Bad Request
        http_response_code( 400 );
        echo "Invalid JSON";
        exit;
    }
// Access the editId from the decoded array
    $editId = 0;
    if (isset($dataArray['editId'])) {
        $editId = $dataArray['editId'];

    }
// Access the table data from the decoded array
    $tableData = $dataArray['tableData'];
    $devparams = $dataArray['devparams'];
// Initialize an array to store the parsed data
    $parameters = [];

// Parse the query string
    parse_str($devparams, $parameters);

    if (isset($parameters['shop'])) {
        $shop = $parameters['shop'];
    } else {
       return;
    }
    $serializedData = serialize($tableData);

    if ($editId == 0) {
        $sizeChart = SizeChart::create([
            'sizechart_data' => $serializedData, // validation rules
            'image_url' => 'https://kodecamps.com',
            'shop_name' => $shop
        ]);
    } else {
        $sizeChart = SizeChart::findOrFail($editId);
        $sizeChart->update([
            'sizechart_data' => $serializedData, // validation rules
            'image_url' => 'https://kodecamps.com',
            'shop_name' => $shop
        ]);
    }


    echo "success";
} );

Route::post('/api/sizechart/fetch', [SizeChartController::class, 'getSizeChart']);


Route::post('/api/sizechart/persist', [SizeChartController::class, 'persistSizeChart']);




<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSizechartsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sizecharts', function (Blueprint $table) {
            $table->id(); // This will create an auto-incrementing primary key column named 'id'
            $table->text('sizechart_data'); // A text column for sizechart data
            $table->string('image_url'); // A varchar column for the image URL
            $table->string('shop_name'); // A varchar column for the shop name
            $table->timestamps(); // Adds created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sizecharts');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSizechartRuleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sizechart_rule', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title')->default('Untitled'); // Set default value for 'title'
            $table->unsignedBigInteger('sizechart_id');
            $table->string('shop_name')->nullable();
            $table->integer('priority')->default(0);
            $table->text('rules');
            $table->text('product_ids')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });

        // If you want to set a specific collation for the table
        Schema::table('sizechart_rule', function (Blueprint $table) {
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sizechart_rule');
    }
}

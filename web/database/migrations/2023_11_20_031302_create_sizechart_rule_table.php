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
            $table->string('title', 255)->default('Untitled');
            $table->unsignedBigInteger('sizechart_id');
            $table->string('shop_name', 255)->nullable();
            $table->integer('priority')->default(0);
            $table->text('rules');
            $table->text('product_ids')->nullable();
            $table->timestamps();

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

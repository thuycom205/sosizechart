<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSizechartRuleCollectionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
        public function up()
    {
        Schema::create('sizechart_rule_collection', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rule_id');
            $table->integer('rule_priority');
            $table->unsignedBigInteger('collection_id');
            $table->string('collection_type');
            $table->timestamps();

            $table->foreign('rule_id')->references('id')->on('sizechart_rule');
            // Add any additional constraints or indexes as needed
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sizechart_rule_collection');
    }
}

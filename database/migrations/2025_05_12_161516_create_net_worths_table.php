<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('net_worths', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->integer('net_worth_goal')->default(0);
            $table->integer('current_net_worth')->default(0);
            $table->integer('amount_left')->default(0);
            $table->unsignedSmallInteger('transaction_per_month')->default(1);
            $table->unsignedSmallInteger('year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('net_worths');
    }
};

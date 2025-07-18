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
        Schema::create('expenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->string('description');
            $table->unsignedInteger('nominal')->default(0);
            $table->string('type');
            $table->foreignUuid('type_detail_id')->constrained('budgets')->cascadeOnDelete();
            $table->foreignUuid('payment_id')->constrained('payments')->cascadeOnDelete();
            $table->string('notes')->nullable();
            $table->string('month');
            $table->unsignedSmallInteger('year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};

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
        Schema::create('spatial_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('site_id')->nullable();
            $table->string('site_name', 150);
            $table->string('action_type', 50); // CREATE, UPDATE, DELETE, BUFFER_CALC, STATUS_CHANGE
            $table->string('user_name', 100);
            $table->string('user_email', 100);
            $table->text('details');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spatial_audit_logs');
    }
};

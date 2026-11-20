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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('GIS Specialist'); // Chief GIS Administrator, Lead Geoscientist, GIS Specialist
            $table->string('department')->default('Subsurface & Geospatial Exploration');
            $table->string('avatar_initials')->default('SE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'department', 'avatar_initials']);
        });
    }
};

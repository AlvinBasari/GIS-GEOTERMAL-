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
        Schema::create('geothermal_sites', function (Blueprint $table) {
            $table->id();
            $table->string('site_code', 50)->unique();
            $table->string('site_name', 150);
            $table->string('operator_company', 150);
            $table->string('company_category', 100);
            $table->boolean('is_star_energy')->default(false);
            $table->string('project_status', 50); // Operational, Under Construction, Exploration, Potential
            $table->string('status_label', 150)->nullable();
            $table->decimal('installed_capacity_mw', 8, 2)->default(0);
            $table->decimal('potential_capacity_mw', 8, 2)->default(0);
            $table->string('enthalpy_type', 50)->default('High Enthalpy');
            $table->integer('reservoir_temp_celsius')->nullable();
            $table->string('wkp_name', 150)->nullable();
            $table->string('island', 100)->default('Jawa');
            $table->string('province', 100);
            $table->string('regency', 100);
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->integer('elevation_masl')->nullable();
            $table->integer('commercial_operation_year')->nullable();
            $table->string('grid_connection', 255)->nullable();
            $table->string('data_source', 255)->default('Ditjen EBTKE Kementerian ESDM');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('geothermal_sites');
    }
};

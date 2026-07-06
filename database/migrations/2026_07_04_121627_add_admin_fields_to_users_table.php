<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->nullable()->after('password');
            $table->string('profile_image')->nullable()->after('role');
            $table->unsignedBigInteger('mobile')->nullable()->after('remember_token');
            $table->string('country')->nullable()->after('mobile');
            $table->string('state')->nullable()->after('country');
            $table->string('city')->nullable()->after('state');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'profile_image', 'mobile', 'country', 'state', 'city']);
            $table->dropSoftDeletes();
        });
    }
};

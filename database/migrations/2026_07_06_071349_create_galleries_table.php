<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['image', 'video']);
            $table->enum('media_source', ['upload', 'youtube'])->nullable();
            $table->string('image_path')->nullable();
            $table->string('video_path')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('thumbnail_path')->nullable();
            $table->text('description')->nullable();
            $table->string('alt_text')->nullable();
            $table->boolean('status')->default(1);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('galleries');
    }
};

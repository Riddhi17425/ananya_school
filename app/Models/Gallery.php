<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Gallery extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title', 'type', 'media_source',
        'image_path', 'video_path', 'youtube_url', 'thumbnail_path',
        'description', 'alt_text', 'status', 'sort_order',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
}

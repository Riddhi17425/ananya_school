<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::withTrashed()->orderBy('sort_order')->orderByDesc('id')->get();
        return view('admin.gallery.index', compact('galleries'));
    }
    public function create()
    {
        return view('admin.gallery.create');
    }

    public function store(Request $request)
    {
        $this->validateGallery($request);

        $data           = $request->only(['title', 'description', 'alt_text', 'sort_order']);
        $data['type']   = $request->type;
        $data['status'] = $request->status;

        if ($request->type === 'image') {
            $data['image_path'] = $this->uploadFile($request->file('image_path'), 'images');
        }

        if ($request->type === 'video') {
            $data['media_source'] = $request->media_source;

            if ($request->media_source === 'upload') {
                $data['video_path'] = $this->uploadFile($request->file('video_path'), 'videos');
            } else {
                $data['youtube_url'] = $request->youtube_url;
            }

            $data['thumbnail_path'] = $this->uploadFile($request->file('thumbnail_path'), 'thumbnails');
        }

        Gallery::create($data);

        return redirect()->route('gallery.index')->with('toast_success', 'Gallery item created successfully.');
    }

    public function edit(Gallery $gallery)
    {
        return view('admin.gallery.edit', compact('gallery'));
    }

    public function update(Request $request, Gallery $gallery)
    {
        $this->validateGallery($request, $gallery->id);

        $data           = $request->only(['title', 'description', 'alt_text', 'sort_order']);
        $data['type']   = $request->type;
        $data['status'] = $request->status;

        if ($request->type === 'image') {
            if ($request->hasFile('image_path')) {
                $this->deleteFile($gallery->image_path);
                $data['image_path'] = $this->uploadFile($request->file('image_path'), 'images');
            }
            // clear leftover video fields if admin switched type from video to image
            $data['media_source']   = null;
            $data['video_path']     = null;
            $data['youtube_url']    = null;
            $data['thumbnail_path'] = null;
        }

        if ($request->type === 'video') {
            $data['media_source'] = $request->media_source;
            $data['image_path']   = null; // clear leftover image field if switched

            if ($request->media_source === 'upload') {
                if ($request->hasFile('video_path')) {
                    $this->deleteFile($gallery->video_path);
                    $data['video_path'] = $this->uploadFile($request->file('video_path'), 'videos');
                }
                $data['youtube_url'] = null;
            } else {
                $data['youtube_url'] = $request->youtube_url;
                $this->deleteFile($gallery->video_path);
                $data['video_path'] = null;
            }

            if ($request->hasFile('thumbnail_path')) {
                $this->deleteFile($gallery->thumbnail_path);
                $data['thumbnail_path'] = $this->uploadFile($request->file('thumbnail_path'), 'thumbnails');
            }
        }

        $gallery->update($data);

        return redirect()->route('gallery.index')->with('toast_success', 'Gallery item updated successfully.');
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete(); // soft delete — files stay on disk in case of restore

        return redirect()->route('gallery.index')->with('toast_success', 'Gallery item deleted.');
    }

    private function validateGallery(Request $request, $id = null)
    {
        $rules = [
            'title'       => 'required|string|max:255',
            'type'        => 'required|in:image,video',
            'description' => 'nullable|string',
            'alt_text'    => 'nullable|string|max:255',
            'sort_order'  => 'nullable|integer',
        ];

        if ($request->type === 'image') {
            $rules['image_path'] = $id
                ? 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
                : 'required|image|mimes:jpeg,png,jpg,webp|max:2048';
        }

        if ($request->type === 'video') {
            $rules['media_source']   = 'required|in:upload,youtube';
            $rules['thumbnail_path'] = $id
                ? 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
                : 'required|image|mimes:jpeg,png,jpg,webp|max:2048';

            if ($request->media_source === 'upload') {
                $rules['video_path'] = $id
                    ? 'nullable|mimes:mp4,mov,avi,wmv|max:20480'
                    : 'required|mimes:mp4,mov,avi,wmv|max:20480';
            } elseif ($request->media_source === 'youtube') {
                $rules['youtube_url'] = 'required|url';
            }
        }

        return Validator::make($request->all(), $rules)->validate();
    }

    private function uploadFile($file, $folder)
    {
        if (! $file) {
            return null;
        }

        $name        = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $destination = public_path('site-assets/gallery/' . $folder);

        if (! File::exists($destination)) {
            File::makeDirectory($destination, 0755, true);
        }

        $file->move($destination, $name);

        return 'site-assets/gallery/' . $folder . '/' . $name;
    }

    private function deleteFile($path)
    {
        if ($path && File::exists(public_path($path))) {
            File::delete(public_path($path));
        }
    }

    public function restore(Gallery $gallery)
    {
        $gallery->restore();
        return redirect()->route('gallery.index')->with('toast_success', 'Gallery item restored.');
    }

    public function updateStatus(Request $request, Gallery $gallery)
    {
        $request->validate(['status' => 'required|in:0,1']);
        $gallery->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => $gallery->status ? 'Marked as Active.' : 'Marked as Inactive.',
        ]);
    }

}

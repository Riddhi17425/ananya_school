<div class="row g-3">
    <div class="col-12">
        <label class="form-label">Title</label>
        <input type="text" name="title" class="form-control" value="{{ old('title', $gallery->title ?? '') }}">
        @error('title') <small class="text-danger">{{ $message }}</small> @enderror
    </div>

   <div class="col-12 col-md-6" id="media-type-col">
    <label class="form-label">Media Type</label>
    <select name="type" id="type" class="form-select">
        <option value="">-- Select --</option>
        <option value="image" {{ old('type', $gallery->type ?? '') == 'image' ? 'selected' : '' }}>Image</option>
        <option value="video" {{ old('type', $gallery->type ?? '') == 'video' ? 'selected' : '' }}>Video</option>
    </select>
    @error('type') <small class="text-danger">{{ $message }}</small> @enderror
</div>

    <div class="col-12 col-md-6" id="media-source-col" style="display:none;">
        <label class="form-label">Video Source</label>
        <select name="media_source" id="media_source" class="form-select">
            <option value="">-- Select --</option>
            <option value="upload" {{ old('media_source', $gallery->media_source ?? '') == 'upload' ? 'selected' : '' }}>Upload Video File</option>
            <option value="youtube" {{ old('media_source', $gallery->media_source ?? '') == 'youtube' ? 'selected' : '' }}>YouTube Link</option>
        </select>
        @error('media_source') <small class="text-danger">{{ $message }}</small> @enderror
    </div>

    <div class="col-12" id="image-fields" style="display:none;">
        <label class="form-label">Image</label>
        <input type="file" name="image_path" class="form-control">
        @isset($gallery)
            @if($gallery->image_path)
                <img src="{{ asset($gallery->image_path) }}" width="100" class="mt-2 rounded d-block">
            @endif
        @endisset
        @error('image_path') <small class="text-danger">{{ $message }}</small> @enderror
    </div>

    <div class="col-12 col-md-12" id="upload-fields" style="display:none;">
        <label class="form-label">Video File</label>
        <input type="file" name="video_path" class="form-control">
        @isset($gallery)
            @if($gallery->video_path)
                <small class="text-muted d-block mt-1">Leave blank to keep the current video below.</small>
                <div class="mt-2">
                    <small class="text-muted d-block mb-1">Current video:</small>
                    <video src="{{ asset($gallery->video_path) }}" controls preload="metadata" style="max-width: 50%; border-radius: 6px;"></video>
                </div>
            @endif
        @endisset
        @error('video_path') <small class="text-danger">{{ $message }}</small> @enderror
    </div>

    <div class="col-12 col-md-6" id="youtube-fields" style="display:none;">
        <label class="form-label">YouTube URL</label>
        <input type="text" name="youtube_url" class="form-control" value="{{ old('youtube_url', $gallery->youtube_url ?? '') }}" placeholder="https://www.youtube.com/watch?v=...">
        @error('youtube_url') <small class="text-danger">{{ $message }}</small> @enderror
    </div>

    <div class="col-12" id="thumbnail-field" style="display:none;">
        <label class="form-label">Thumbnail Image</label>
        <input type="file" name="thumbnail_path" class="form-control">
        @isset($gallery)
            @if($gallery->thumbnail_path)
                <img src="{{ asset($gallery->thumbnail_path) }}" width="200" class="mt-2 rounded d-block">
            @endif
        @endisset
        @error('thumbnail_path') <small class="text-danger">{{ $message }}</small> @enderror
    </div>

    <div class="col-12">
        <label class="form-label">Description</label>
        <textarea name="description" class="form-control" rows="3">{{ old('description', $gallery->description ?? '') }}</textarea>
    </div>

    <div class="col-12 col-md-6">
        <label class="form-label">Alt Text</label>
        <input type="text" name="alt_text" class="form-control" value="{{ old('alt_text', $gallery->alt_text ?? '') }}">
    </div>

    <div class="col-12 col-md-6">
        <label class="form-label">Sort Order</label>
        <input type="number" name="sort_order" class="form-control" value="{{ old('sort_order', $gallery->sort_order ?? 0) }}">
    </div>

    <div class="col-12 col-md-6">
    <label class="form-label">Status</label>
    <select name="status" class="form-select">
        <option value="1" {{ old('status', $gallery->status ?? true) ? 'selected' : '' }}>Active</option>
        <option value="0" {{ !old('status', $gallery->status ?? true) ? 'selected' : '' }}>Inactive</option>
    </select>
</div>

    <div class="col-12">
        <button type="submit" class="btn btn-primary">Save</button>
        <a href="{{ route('gallery.index') }}" class="btn btn-secondary">Cancel</a>
    </div>
</div>

<script>
    function toggleGalleryFields() {
        const type = document.getElementById('type').value;
        const mediaSourceEl = document.getElementById('media_source');
        const mediaSource = mediaSourceEl ? mediaSourceEl.value : '';
        const isVideo = type === 'video';

        document.getElementById('image-fields').style.display = type === 'image' ? 'block' : 'none';
        document.getElementById('media-source-col').style.display = isVideo ? 'block' : 'none';
        document.getElementById('thumbnail-field').style.display = isVideo ? 'block' : 'none';
        document.getElementById('upload-fields').style.display = (isVideo && mediaSource === 'upload') ? 'block' : 'none';
        document.getElementById('youtube-fields').style.display = (isVideo && mediaSource === 'youtube') ? 'block' : 'none';

        // Media Type goes full-width when there's no Video Source column beside it
        const mediaTypeCol = document.getElementById('media-type-col');
        mediaTypeCol.classList.toggle('col-md-6', isVideo);
        mediaTypeCol.classList.toggle('col-12', !isVideo);
    }

    document.getElementById('type').addEventListener('change', toggleGalleryFields);
    document.getElementById('media_source')?.addEventListener('change', toggleGalleryFields);
    toggleGalleryFields(); // run once on load so edit page shows correct fields pre-filled
</script>

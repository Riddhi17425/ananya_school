@extends('admin.layouts.master')

@section('content')
<style>
    #galleryTable.dataTable {
        margin-top: 20px !important;
        margin-bottom:10px !important;
    }
</style>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h4>Gallery</h4>
    <a href="{{ route('gallery.create') }}" class="btn btn-primary">+ Add New</a>
</div>

<div class="card p-3">
    <table class="table table-bordered" id="galleryTable">
        <thead>
            <tr>
                <th>#</th>
                <th>Preview</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($galleries as $gallery)
                <tr class="{{ $gallery->trashed() ? 'table-secondary' : '' }}">
                    <td>{{ $loop->iteration }}</td>
                    <td>
                        @if ($gallery->type === 'image' && $gallery->image_path)
                            <img src="{{ asset($gallery->image_path) }}" width="60" class="rounded">
                        @elseif ($gallery->type === 'video' && $gallery->thumbnail_path)
                            <img src="{{ asset($gallery->thumbnail_path) }}" width="60" class="rounded">
                        @else
                            —
                        @endif
                    </td>
                    <td>{{ $gallery->title }}</td>
                    <td><span class="badge bg-secondary text-uppercase">{{ $gallery->type }}</span></td>
                    <td>
                        @if ($gallery->trashed())
                            <span class="badge bg-dark">Trashed</span>
                        @elseif ($gallery->status)
                            <span class="badge bg-success">Active</span>
                        @else
                            <span class="badge bg-danger">Inactive</span>
                        @endif
                    </td>
                    <td>{{ $gallery->sort_order }}</td>
                    <td>
                        @if ($gallery->trashed())
                            <form action="{{ route('gallery.restore', $gallery->id) }}" method="POST" style="display:inline-block">
                                @csrf
                                @method('PUT')
                                <button type="submit" class="btn btn-sm btn-success">Restore</button>
                            </form>
                            <form action="{{ route('gallery.forceDelete', $gallery->id) }}" method="POST" style="display:inline-block"
                                  onsubmit="return confirm('Permanently delete this item and its files? This cannot be undone.');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-danger">Delete Permanently</button>
                            </form>
                        @else
                            <a href="{{ route('gallery.edit', $gallery->id) }}" class="btn btn-sm btn-warning">Edit</a>
                            <button type="button" class="btn btn-sm btn-danger delete-trigger"
                                    data-title="{{ $gallery->title }}"
                                    data-soft-url="{{ route('gallery.destroy', $gallery->id) }}"
                                    data-force-url="{{ route('gallery.forceDelete', $gallery->id) }}"
                                    data-bs-toggle="modal" data-bs-target="#deleteChoiceModal">
                                Delete
                            </button>
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>

<div class="modal fade" id="deleteChoiceModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Delete "<span id="deleteItemTitle"></span>"</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p class="mb-2"><strong>Move to Trash</strong> — hides it from the site but keeps it recoverable, with a Restore option.</p>
        <p class="mb-0"><strong>Delete Permanently</strong> — removes it and its files forever. Cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <form id="softDeleteForm" method="POST" action="">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-warning">Move to Trash</button>
        </form>
        <form id="forceDeleteForm" method="POST" action=""
              onsubmit="return confirm('Permanently delete this item and its files? This cannot be undone.');">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-danger">Delete Permanently</button>
        </form>
      </div>
    </div>
  </div>
</div>

@push('scripts')
<script>
    $(document).ready(function () {
        $('#galleryTable').DataTable();
    });

    document.querySelectorAll('.delete-trigger').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.getElementById('deleteItemTitle').textContent = this.dataset.title;
            document.getElementById('softDeleteForm').action = this.dataset.softUrl;
            document.getElementById('forceDeleteForm').action = this.dataset.forceUrl;
        });
    });
</script>
@endpush
@endsection

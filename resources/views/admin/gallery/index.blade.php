@extends('admin.layouts.master')

@section('content')
<style>
    #galleryTable.dataTable {
        margin-top: 20px !important;
        margin-bottom: 10px !important;
    }

    /* Fix DataTables pagination numbers hidden by ebazar theme */
    #galleryTable_paginate .pagination .page-link {
        color: #495057 !important;
        background-color: #fff !important;
        border: 1px solid #dee2e6 !important;
    }
    #galleryTable_paginate .pagination .page-item.active .page-link {
        color: #fff !important;
        background-color: var(--primary-color) !important;
        border-color: var(--primary-color) !important;
    }
    #galleryTable_paginate .pagination .page-item.disabled .page-link {
        color: #adb5bd !important;
        background-color: #f8f9fa !important;
    }

    .btn-icon {
        width: 34px;
        height: 34px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
    }

    .status-switch {
        cursor: pointer;
    }

    .btn:hover {
        color: #eff7ff;
    }

    .status-switch {
    width: 2.75em !important;
    height: 1.4em !important;
    cursor: pointer;
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
                <th>ID</th>
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
                <tr>
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
                        @else
                            <div class="d-flex align-items-center gap-2">
                                <div class="form-check form-switch">
                                    <input class="form-check-input status-switch" type="checkbox" role="switch"
                                        data-id="{{ $gallery->id }}"
                                        {{ $gallery->status ? 'checked' : '' }}>
                                </div>
                                <span class="status-label small fw-semibold {{ $gallery->status ? 'text-success' : 'text-danger' }}">
                                    {{ $gallery->status ? 'Active' : 'Inactive' }}
                                </span>
                            </div>
                        @endif
                    </td>
                    <td>{{ $gallery->sort_order }}</td>
                    <td class="text-nowrap">
                        @if ($gallery->trashed())
                            <form action="{{ route('gallery.restore', $gallery->id) }}" method="POST" style="display:inline-block">
                                @csrf
                                @method('PUT')
                                <button type="submit" class="btn btn-sm btn-success">Restore</button>
                            </form>
                        @else
                            <a href="{{ route('gallery.edit', $gallery->id) }}" class="btn btn-icon btn-outline-dark" title="Edit">
                                <i class="bi bi-pencil-square"></i>
                            </a>
                            <button type="button" class="btn btn-icon btn-outline-danger delete-trigger"
                                    data-title="{{ $gallery->title }}"
                                    data-soft-url="{{ route('gallery.destroy', $gallery->id) }}"
                                    data-bs-toggle="modal" data-bs-target="#deleteChoiceModal" title="Delete">
                                <i class="bi bi-trash"></i>
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
        <h5 class="modal-title">Delete "<span id="deleteItemTitle"></span>"?</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p class="mb-0">Are you sure you want to delete this item? You can restore it later from the trash.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
        <form id="softDeleteForm" method="POST" action="">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-danger">Yes</button>
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
        });
    });

    // Instant status toggle
   document.querySelectorAll('.status-switch').forEach(function (sw) {
    sw.addEventListener('change', function () {
        const id = this.dataset.id;
        const newStatus = this.checked ? 1 : 0;
        const toggle = this;
        const label = this.closest('.d-flex').querySelector('.status-label');

        fetch(`/admin/gallery/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                label.textContent = newStatus ? 'Active' : 'Inactive';
                label.classList.toggle('text-success', newStatus === 1);
                label.classList.toggle('text-danger', newStatus === 0);
                showAppToast('success', data.message);
            } else {
                toggle.checked = !toggle.checked;
                showAppToast('error', 'Could not update status.');
            }
        })
        .catch(() => {
            toggle.checked = !toggle.checked;
            showAppToast('error', 'Could not update status.');
        });
    });
});

    // Same style/behavior as the session-based toast, but callable instantly from JS
    function showAppToast(type, message) {
        const existing = document.getElementById('app-toast');
        if (existing) existing.remove();

        const colors = { success: '#28a745', error: '#dc3545', info: '#17a2b8' };
        const icons  = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };

        const toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            min-width: 280px; max-width: 380px; background: #fff;
            border-left: 5px solid ${colors[type]}; border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 14px 18px;
            display: flex; align-items: center; gap: 10px;
            opacity: 0; transform: translateX(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
        toast.innerHTML = `
            <i class="bi ${icons[type]}" style="color: ${colors[type]}; font-size: 1.3rem;"></i>
            <span style="flex: 1; color: #333; font-size: 0.95rem;">${message}</span>
            <button onclick="document.getElementById('app-toast').remove()" style="background: none; border: none; color: #999; font-size: 1.1rem; cursor: pointer; line-height: 1;">&times;</button>
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
</script>
@endpush
@endsection

@extends('admin.layouts.master')

@section('content')
<div class="card p-4">
    <h4 class="mb-4">Edit Gallery Item</h4>
    <form method="POST" action="{{ route('gallery.update', $gallery->id) }}" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        @include('admin.gallery._form')
    </form>
</div>
@endsection

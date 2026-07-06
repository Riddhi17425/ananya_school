@extends('admin.layouts.master')

@section('content')
<div class="card p-4">
    <h4 class="mb-4">Add Gallery Item</h4>
    <form method="POST" action="{{ route('gallery.store') }}" enctype="multipart/form-data">
        @csrf
        @include('admin.gallery._form')
    </form>
</div>
@endsection

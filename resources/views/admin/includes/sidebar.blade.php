<div class="sidebar px-4 py-4 py-md-4 me-0">
    <div class="d-flex flex-column h-100">
        <a href="{{ route('dashboard') }}" class="mb-0 brand-icon">
            <span class="logo-icon"><i class="bi bi-mortarboard-fill fs-4"></i></span>
            <span class="logo-text">Ananya School</span>
        </a>
        <ul class="menu-list flex-grow-1 mt-3">
            <li>
                <a class="m-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
                    <i class="icofont-home fs-5"></i> <span>Dashboard</span>
                </a>
            </li>
            <li class="collapsed">
                <a class="m-link {{ request()->routeIs('gallery.*') ? 'active' : '' }}" href="{{ route('gallery.index') }}">
                    <i class="bi bi-images fs-5 me-2"></i> <span>Gallery</span>
                </a>
            </li>
            {{-- more modules get added here as we build them out --}}
        </ul>
        <button type="button" class="btn btn-link sidebar-mini-btn text-light">
            <span class="ms-2"><i class="icofont-bubble-right"></i></span>
        </button>
    </div>
</div>

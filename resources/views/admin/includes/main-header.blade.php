<div class="header">
    <nav class="navbar py-4">
        <div class="container-xxl">
            <div class="h-right d-flex align-items-center mr-5 mr-lg-0 order-1">
                <div class="dropdown user-profile ml-2 ml-sm-3 d-flex align-items-center zindex-popover">
                    <div class="u-info me-2">
                        <p class="mb-0 text-end line-height-sm"><span class="font-weight-bold">{{ Auth::user()->name }}</span></p>
                        @if (Auth::user()->role == 1)
                            <small>Super Admin Profile</small>
                        @elseif(Auth::user()->role == 2)
                            <small>Admin Profile</small>
                        @endif
                    </div>
                    <a class="nav-link dropdown-toggle pulse p-0" href="#" role="button" data-bs-toggle="dropdown" data-bs-display="static">
                        <img class="avatar lg rounded-circle img-thumbnail" src="{{ asset('site-assets/assets/images/profile_av.svg') }}" alt="profile">
                    </a>
                    <div class="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0">
                        <div class="card border-0 w280">
                            <div class="card-body pb-0">
                                <div class="d-flex py-1">
                                    <img class="avatar rounded-circle" src="{{ asset('site-assets/assets/images/profile_av.svg') }}" alt="profile">
                                    <div class="flex-fill ms-3">
                                        <p class="mb-0"><span class="font-weight-bold">{{ Auth::user()->name }}</span></p>
                                        <small>{{ Auth::user()->email }}</small>
                                    </div>
                                </div>
                                <div><hr class="dropdown-divider border-dark"></div>
                            </div>
                            <div class="list-group m-2">
                                <form action="{{ route('logout') }}" method="POST">
                                    @csrf
                                    <button type="submit" class="list-group-item list-group-item-action border-0"><i class="icofont-logout fs-5 me-3"></i>Signout</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="navbar-toggler p-0 border-0 menu-toggle order-3" type="button" data-bs-toggle="collapse" data-bs-target="#mainHeader">
                <span class="fa fa-bars"></span>
            </button>
            <div class="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0"></div>
        </div>
    </nav>
</div>

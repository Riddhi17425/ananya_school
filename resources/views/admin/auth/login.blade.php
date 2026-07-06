@include('admin.includes.headerUrl')
@include('admin.includes.toast')
<div id="ebazar-layout" class="theme-blue">
    <div class="main p-2 py-3 p-xl-5">
        <div class="body d-flex p-0 p-xl-5">
            <div class="container-xxl">
                <div class="row g-0">
                    <div class="col-lg-6 d-none d-lg-flex justify-content-center align-items-center rounded-lg auth-h100">
                        <div style="max-width: 25rem;">
                            <div class="text-center mb-5">
                                <i class="bi bi-bag-check-fill text-primary" style="font-size: 90px;"></i>
                            </div>
                            <div class="mb-5">
                                <h2 class="color-900 text-center">A few clicks is all it takes.</h2>
                            </div>
                            @if ($errors->any())
                                <div class="alert alert-danger">
                                    <ul>
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                            @endif
                            <div class="">
                                <img src="{{ asset('site-assets/assets/images/signup_image.png')}}" alt="login-img">
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
                        <div class="w-100 p-3 p-md-5 card border-0 shadow-sm" style="max-width: 32rem;">
                            <form class="row g-1 p-3 p-md-4" method="post" action="{{ route('login') }}">
                                @csrf
                                <div class="col-12 text-center mb-5">
                                    <h1>Sign in</h1>
                                </div>
                                <div class="col-12">
                                    <div class="mb-2">
                                        <label class="form-label">Email address</label>
                                        <input type="email" class="form-control form-control-lg" name="email" value="{{ old('email') }}" placeholder="name@example.com">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="mb-2">
                                        <div class="form-label">
                                            <span class="d-flex justify-content-between align-items-center">
                                                Password
                                            </span>
                                        </div>
                                        <input type="password" name="password" class="form-control form-control-lg" placeholder="***************">
                                    </div>
                                </div>
                                <div class="col-12 text-center mt-4">
                                    <button class="btn btn-lg btn-block btn-light lift text-uppercase" type="submit">SIGN IN</button>
                                </div>
                                <div class="col-12 text-center mt-4">
                                    <span>Don't have an account yet? <a href="{{ route('register') }}" class="text-secondary">Sign up here</a></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@include('admin.includes.footer')
</body>
</html>

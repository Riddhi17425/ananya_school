@include('admin.includes.headerUrl')
@include('admin.includes.toast')
<style>
    /* Override the theme's fixed height on the signup page only,
       so tall forms push the page height instead of being clipped/scroll-boxed */
    .auth-h100 {
        height: auto !important;
        min-height: 100vh;
    }
</style>
<div id="ebazar-layout" class="theme-blue">
    <div class="main p-2 py-3 p-xl-5">
        <div class="body d-flex p-0">
            <div class="container-xxl">
                <div class="row g-0">
                    <div class="col-lg-6 d-none d-lg-flex justify-content-center align-items-start rounded-lg auth-h100">
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

                    <div class="col-lg-6 d-flex justify-content-center align-items-start border-0 rounded-lg auth-h100">
                        <div class="w-100 p-3 p-md-5 card border-0 shadow-sm" style="max-width: 32rem;">
                            <form class="row g-1 p-3 p-md-4" method="post" action="{{ route('register') }}" enctype="multipart/form-data">
                                @csrf
                                <div class="col-12 text-center mb-5">
                                    <h1>Create your account</h1>
                                </div>
                                <div class="col-12">
                                    <div class="mb-2">
                                        <label class="form-label">Full name</label>
                                        <input type="text" name="name" class="form-control form-control-lg" placeholder="John" value="{{ old('name') }}">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="mb-2">
                                        <label class="form-label">Email address</label>
                                        <input type="email" name="email" class="form-control form-control-lg" placeholder="name@example.com" value="{{ old('email') }}">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="mb-2">
                                        <label class="form-label">Profile Picture</label>
                                        <input type="file" name="profile_picture" class="form-control form-control-lg">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="mb-2">
                                        <label class="form-label">Password</label>
                                        <input type="password" name="password" class="form-control form-control-lg" placeholder="8+ characters required">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="mb-2">
                                        <label class="form-label">Confirm password</label>
                                        <input type="password" name="password_confirmation" class="form-control form-control-lg" placeholder="8+ characters required">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                                        <label class="form-check-label" for="flexCheckDefault">
                                            I accept the <a href="#" title="Terms and Conditions" class="text-secondary">Terms and Conditions</a>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-12 text-center mt-4">
                                    <button type="submit" class="btn btn-lg btn-block btn-light lift text-uppercase">SIGN UP</button>
                                </div>
                                <div class="col-12 text-center mt-4">
                                    <span>Already have an account? <a href="{{ route('login') }}" class="text-secondary">Sign in here</a></span>
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

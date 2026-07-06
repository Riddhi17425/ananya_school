<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    public function register_page()
    {
        return view('admin.auth.signup');
    }

    public function login_page()
    {
        return view('admin.auth.login');
    }

    public function register(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'name'            => 'required',
            'email'           => 'required|email|unique:users,email',
            'password'        => 'required|confirmed|min:8',
            'profile_picture' => 'required|mimetypes:image/jpeg,image/png,image/webp|max:2048',
        ]);

        if ($validate->fails()) {
            return redirect('register')
                ->withErrors($validate)
                ->withInput();
        }

        $imagePath = '';
        if ($request->hasFile('profile_picture')) {
            $image     = $request->file('profile_picture');
            $imageName = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('site-assets/user/profile'), $imageName);
            $imagePath = 'site-assets/user/profile/' . $imageName;
        }

        $user                = new User();
        $user->name          = $request->name;
        $user->email         = $request->email;
        $user->password      = Hash::make($request->password);
        $user->role          = 3; // self-registered accounts default to 'sales'
        $user->profile_image = $imagePath;
        $user->save();

        Auth::login($user);
        return redirect()->route('dashboard');
    }

    public function login(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if ($validate->fails()) {
            return redirect('login')
                ->withErrors($validate)
                ->withInput();
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->route('dashboard')
                ->with('toast_success', 'Login successful! Welcome back, ' . Auth::user()->name . '.');
        }

        return back()->withErrors([
            'email' => 'Invalid email or password.',
        ])->withInput();
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')
            ->with('toast_info', 'You have been signed out.');
    }
}

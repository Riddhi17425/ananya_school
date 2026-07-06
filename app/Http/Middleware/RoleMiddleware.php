<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $role = Auth::user()->role;

        $roleMap = [
            1 => 'super_admin',
            2 => 'admin',
            3 => 'sales',
        ];

        $userRole = $roleMap[$role] ?? null;

        // Sales accounts have no business in the admin panel — kick them out
        if ($userRole === 'sales') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->withErrors(['access' => 'You do not have access to this section.']);
        }

        if ($userRole && in_array($userRole, $roles)) {
            return $next($request);
        }

        abort(403, 'Unauthorized access.');
    }
}

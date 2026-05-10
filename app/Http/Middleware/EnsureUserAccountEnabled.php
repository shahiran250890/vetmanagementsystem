<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserAccountEnabled
{
    /**
     * Log out users whose accounts have been disabled and redirect to the access-denied screen.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check()) {
            return $next($request);
        }

        /** @var User|null $fresh */
        $fresh = User::query()->find(Auth::id());

        if ($fresh === null || $fresh->is_enabled) {
            return $next($request);
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login.access-denied');
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render("Auth/Login", [
            "canResetPassword" => Route::has("password.request"),
            "status" => session("status"),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        // This is the admin panel: only active staff may sign in.
        $user = $request->user();
        $isStaff = $user->is_active && $user->hasRole([
            Role::SUPER_ADMIN, Role::ADMIN, Role::MANAGER, Role::SUPPORT,
        ]);

        if (! $isStaff) {
            Auth::guard("web")->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw ValidationException::withMessages([
                "email" => "This account does not have access to the admin panel.",
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route("admin.dashboard", absolute: false));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard("web")->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route("login");
    }
}

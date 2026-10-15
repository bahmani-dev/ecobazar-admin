<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

// ── MERGE NOTE ───────────────────────────────────────────────────────────
// Merge the `auth` block below into your existing HandleInertiaRequests::share().
// It's what lets the React side (usePermission hook, Sidebar) know the
// current user's role and permission list without an extra request.
// ────────────────────────────────────────────────────────────────────────

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ? [
                        'slug' => $user->role->slug,
                        'name' => $user->role->name,
                        'level' => $user->role->level,
                    ] : null,
                    'permissions' => $user->role
                        ? $user->role->slug === \App\Models\Role::SUPER_ADMIN
                            ? ['*'] // super admin: client treats this as "all permissions"
                            : $user->role->permissions()->pluck('slug')
                        : [],
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
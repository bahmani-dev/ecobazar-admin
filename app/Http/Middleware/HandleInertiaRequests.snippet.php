<?php
// MERGE the `auth` and `flash` entries into your existing HandleInertiaRequests::share()

    public function share(Request $request): array
    {
        $user = $request->user()?->loadMissing('role.permissions');

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role?->only(['slug', 'name', 'level']),
                    'permissions' => $user->role?->slug === \App\Models\Role::SUPER_ADMIN
                        ? ['*']
                        : ($user->role?->permissions->pluck('slug')->all() ?? []),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

<?php

namespace App\Providers;

use App\Listeners\LogSuccessfulLogin;
use App\Models\ActivityLog;
use App\Models\Role;
use App\Models\User;
use App\Policies\ActivityLogPolicy;
use App\Policies\RolePolicy;
use App\Policies\UserPolicy;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Policy registration (explicit, so it works regardless of auto-discovery)
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(ActivityLog::class, ActivityLogPolicy::class);

        // Audit log + last-login tracking. The listener method is named onLogin()
        // (not handle()) so Laravel 11/12 event auto-discovery does NOT also pick
        // it up, which would log every sign-in twice.
        Event::listen(Login::class, [LogSuccessfulLogin::class, "onLogin"]);
    }
}

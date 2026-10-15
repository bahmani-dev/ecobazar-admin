<?php

namespace App\Providers;

use App\Models\ActivityLog;
use App\Models\Role;
use App\Models\User;
use App\Policies\ActivityLogPolicy;
use App\Policies\RolePolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

/*
|--------------------------------------------------------------------------
| Registering policies
|--------------------------------------------------------------------------
| If your app is on Laravel 11/12 with the streamlined bootstrap/app.php
| and no AuthServiceProvider by default, either:
|   (a) add this file back and register it in bootstrap/providers.php, or
|   (b) put the $policies map + boot() registerPolicies() call directly
|       into your existing AppServiceProvider::boot().
*/
class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        Role::class => RolePolicy::class,
        ActivityLog::class => ActivityLogPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
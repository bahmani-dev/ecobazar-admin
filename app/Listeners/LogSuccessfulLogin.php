<?php

namespace App\Listeners;

use App\Services\ActivityLogger;
use Illuminate\Auth\Events\Login;

class LogSuccessfulLogin
{
    public function onLogin(Login $event): void
    {
        $user = $event->user;

        // Only staff sign-ins are audited; customers / inactive accounts are ignored.
        if (! $user->role_id || ! $user->is_active) {
            return;
        }

        $user->forceFill([
            "last_login_at" => now(),
            "last_login_ip" => request()->ip(),
        ])->saveQuietly();

        ActivityLogger::log("login", "{$user->name} signed in", $user);
    }
}

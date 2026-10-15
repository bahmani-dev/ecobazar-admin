<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** bootstrap/app.php: $middleware->alias(['permission' => EnsureUserHasPermission::class]); */
class EnsureUserHasPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        abort_if(! $user || ! $user->is_active, 403, 'Your account is inactive.');
        abort_unless($user->hasPermission($permission), 403, 'You do not have permission to do that.');

        return $next($request);
    }
}

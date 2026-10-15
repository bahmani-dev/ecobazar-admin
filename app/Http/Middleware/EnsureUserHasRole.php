<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** bootstrap/app.php: $middleware->alias(['role' => EnsureUserHasRole::class]); */
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        abort_if(! $user || ! $user->is_active, 403, 'Your account is inactive.');
        abort_unless($user->hasRole($roles), 403, 'You do not have access to this area.');

        return $next($request);
    }
}

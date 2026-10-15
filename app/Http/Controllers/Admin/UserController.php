<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $users = User::query()
            ->with('role:id,name,slug,level')
            ->when($request->string('search')->toString(), fn ($q, $s) => $q->where(
                fn ($q) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")
            ))
            ->when($request->string('role')->toString(), fn ($q, $r) => $q->whereHas('role', fn ($q) => $q->where('slug', $r)))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        $actor = $request->user();
        $users->getCollection()->transform(function (User $u) use ($actor) {
            $u->setAttribute('can', [
                'update' => $actor->can('update', $u),
                'delete' => $actor->can('delete', $u),
            ]);
            return $u;
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => Role::orderByDesc('level')->get(['id', 'name', 'slug']),
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('Admin/Users/Create', ['roles' => $this->assignableRoles($request->user())]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            ...$request->safe()->only(['name', 'email', 'password', 'role_id']),
            'is_active' => $request->boolean('is_active', true),
        ]); // password is hashed by the model cast

        ActivityLogger::log('created', "{$request->user()->name} created user \"{$user->name}\"", $user);

        return to_route('admin.users.index')->with('success', 'User created.');
    }

    public function edit(Request $request, User $user): Response
    {
        $this->authorize('update', $user);

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->only(['id', 'name', 'email', 'role_id', 'is_active']),
            'roles' => $this->assignableRoles($request->user()),
            'isSelf' => $request->user()->is($user),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $actor = $request->user();
        $keys = ['name', 'email', 'role_id', 'is_active'];
        $before = $user->only($keys);

        $roleChanged = (int) $request->validated('role_id') !== (int) $user->role_id;
        if ($roleChanged) {
            $this->authorize('assignRole', $user);
        }

        // Guard against locking yourself out.
        if ($actor->is($user) && ($roleChanged || ! $request->boolean('is_active'))) {
            return back()->with('error', 'You cannot change your own role or deactivate yourself.');
        }

        $user->fill([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'role_id' => $request->validated('role_id'),
            'is_active' => $request->boolean('is_active'),
        ]);

        if ($request->filled('password')) {
            $user->password = $request->validated('password');
        }

        $user->save();
        $user->load('role');

        ActivityLogger::log('updated', "{$actor->name} updated user \"{$user->name}\"", $user, [
            'before' => $before,
            'after' => $user->only($keys),
        ]);

        if ($roleChanged) {
            ActivityLogger::log('role_assigned', "{$actor->name} set \"{$user->name}\" to {$user->role->name}", $user);
        }

        return to_route('admin.users.index')->with('success', 'User updated.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $user->delete();

        ActivityLogger::log('deleted', "{$request->user()->name} deleted user \"{$user->name}\"", properties: [
            'user_id' => $user->id, 'email' => $user->email,
        ]);

        return to_route('admin.users.index')->with('success', 'User deleted.');
    }

    /** Roles the actor may hand out: at or below their own level (super admin: all). */
    private function assignableRoles(User $actor)
    {
        return Role::query()
            ->when($actor->role?->slug !== Role::SUPER_ADMIN, fn ($q) => $q->where('level', '<=', $actor->role?->level ?? 0))
            ->orderByDesc('level')
            ->get(['id', 'name', 'slug', 'level']);
    }
}

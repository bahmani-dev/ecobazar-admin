<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Inertia\Inertia;
use Inertia\Response;


class RoleController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Role::class);

        return Inertia::render('Admin/Roles/Index', [
            'roles' => Role::withCount('users')->with('permissions:id,slug')->orderByDesc('level')->get(),
            'permissions' => Permission::orderBy('group')->orderBy('name')->get(['id', 'name', 'slug', 'group'])->groupBy('group'),
        ]);
    }
}

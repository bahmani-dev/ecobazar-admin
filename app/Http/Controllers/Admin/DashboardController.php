<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'active_users' => User::where('is_active', true)->count(),
                'staff_users' => User::whereNotNull('role_id')->count(),
                'roles_count' => Role::count(),
            ],
            'recentActivity' => ActivityLog::with('user:id,name')->latest()->limit(8)->get(),
        ]);
    }
}

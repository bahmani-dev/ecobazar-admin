<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ActivityLog::class);

        $logs = ActivityLog::query()
            ->with('user:id,name,email')
            ->when($request->integer('user_id'), fn ($q, $id) => $q->where('user_id', $id))
            ->when($request->string('action')->toString(), fn ($q, $a) => $q->where('action', $a))
            ->when($request->date('from'), fn ($q, $d) => $q->whereDate('created_at', '>=', $d))
            ->when($request->date('to'), fn ($q, $d) => $q->whereDate('created_at', '<=', $d))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Admin/ActivityLog/Index', [
            'logs' => $logs,
            'users' => User::whereNotNull('role_id')->orderBy('name')->get(['id', 'name']),
            'actions' => ActivityLog::query()->distinct()->orderBy('action')->pluck('action'),
            'filters' => $request->only(['user_id', 'action', 'from', 'to']),
        ]);
    }
}

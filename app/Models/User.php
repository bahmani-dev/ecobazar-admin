<?php

namespace App\Models;

// ── MERGE NOTE ───────────────────────────────────────────────────────────
// This is your existing User model with the admin/RBAC pieces added.
// Copy the highlighted additions into your real app/Models/User.php
// instead of overwriting it wholesale if you've already customized it.
// ────────────────────────────────────────────────────────────────────────

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    // ── Admin / RBAC additions ──────────────────────────────────────────

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    /**
     * True if the user's role slug matches any of the given slugs.
     */
    public function hasRole(string|array $slug): bool
    {
        if (! $this->role) {
            return false;
        }

        return in_array($this->role->slug, (array) $slug, true);
    }

    /**
     * True if the user's role grants the given permission slug.
     * Super admin implicitly has every permission.
     */
    public function hasPermission(string $slug): bool
    {
        if (! $this->role) {
            return false;
        }

        if ($this->role->slug === Role::SUPER_ADMIN) {
            return true;
        }

        return $this->role->permissions()->where('slug', $slug)->exists();
    }

    /**
     * True if this user can act on a target user without escalating
     * privilege (e.g. an admin cannot edit/delete a super admin).
     */
    public function outranks(User $target): bool
    {
        $myLevel = $this->role?->level ?? 0;
        $theirLevel = $target->role?->level ?? 0;

        return $myLevel > $theirLevel || $this->is($target);
    }

    public function isAdminUser(): bool
    {
        return $this->hasRole([Role::SUPER_ADMIN, Role::ADMIN, Role::MANAGER, Role::SUPPORT]);
    }
}
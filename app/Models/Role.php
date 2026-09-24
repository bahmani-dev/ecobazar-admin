<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    /**
     * Canonical role slugs. Keep in sync with RolesAndPermissionsSeeder.
     */
    public const SUPER_ADMIN = 'super_admin';

    public const ADMIN = 'admin';

    public const MANAGER = 'manager';

    public const SUPPORT = 'support';

    protected $fillable = ['name', 'slug', 'level', 'description'];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class)->withTimestamps();
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function hasPermission(string $slug): bool
    {
        return $this->permissions()->where('slug', $slug)->exists();
    }
}

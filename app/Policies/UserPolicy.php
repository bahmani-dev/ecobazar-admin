<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool { return $user->hasPermission('users.view'); }

    public function create(User $user): bool { return $user->hasPermission('users.create'); }

    public function update(User $user, User $target): bool
    {
        return $user->hasPermission('users.update') && $user->outranks($target);
    }

    public function delete(User $user, User $target): bool
    {
        return $user->hasPermission('users.delete') && $user->outranks($target) && ! $user->is($target);
    }

    public function assignRole(User $user, User $target): bool
    {
        return $user->hasPermission('users.assign_role') && $user->outranks($target);
    }
}

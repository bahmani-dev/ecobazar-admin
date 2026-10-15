<?php

namespace App\Http\Requests\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', User::class);
    }

    public function rules(): array
    {
        $actor = $this->user();

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            // Server-side guard: only roles at or below the actor's level are assignable.
            'role_id' => ['required', function ($attr, $value, $fail) use ($actor) {
                $role = Role::find($value);
                if (! $role || ($actor->role?->slug !== Role::SUPER_ADMIN && $role->level > ($actor->role?->level ?? 0))) {
                    $fail('You cannot assign that role.');
                }
            }],
            'is_active' => ['boolean'],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('user'));
    }

    public function rules(): array
    {
        $actor = $this->user();

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($this->route('user')->id)],
            'password' => ['nullable', 'confirmed', Password::defaults()],
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

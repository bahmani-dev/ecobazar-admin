<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ecobazar.test'],
            [
                'name' => 'Ecobazar Super Admin',
                'password' => 'password', // hashed by model cast; CHANGE after first login
                'role_id' => Role::where('slug', Role::SUPER_ADMIN)->firstOrFail()->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}

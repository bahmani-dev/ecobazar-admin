<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'users' => [
                'users.view' => 'View users',
                'users.create' => 'Create users',
                'users.update' => 'Update users',
                'users.delete' => 'Delete users',
                'users.assign_role' => 'Assign roles to users',
            ],
            'roles' => [
                'roles.view' => 'View roles & permissions',
            ],
            'activity_log' => [
                'activity_log.view' => 'View activity / audit log',
            ],
            'catalog' => [
                'catalog.view' => 'View products, categories & attributes',
                'catalog.manage' => 'Create/update/delete catalog items',
            ],
            'orders' => [
                'orders.view' => 'View orders',
                'orders.manage' => 'Update order status / fulfilment',
            ],
            'content' => [
                'content.manage' => 'Manage blog posts & pages',
            ],
            'support' => [
                'support.view' => 'View customer support tickets',
                'support.manage' => 'Respond to / resolve support tickets',
            ],
        ];

        $permissionModels = [];
        foreach ($permissions as $group => $items) {
            foreach ($items as $slug => $name) {
                $permissionModels[$slug] = Permission::updateOrCreate(
                    ['slug' => $slug],
                    ['name' => $name, 'group' => $group]
                );
            }
        }

        $roles = [
            [
                'slug' => Role::SUPER_ADMIN,
                'name' => 'Super Admin',
                'level' => 100,
                'description' => 'Full, unrestricted access to everything, including managing other admins.',
                'permissions' => array_keys($permissionModels), // gets everything anyway via User::hasPermission()
            ],
            [
                'slug' => Role::ADMIN,
                'name' => 'Admin',
                'level' => 80,
                'description' => 'Runs day-to-day operations: catalog, orders, content, and non-admin users.',
                'permissions' => [
                    'users.view', 'users.create', 'users.update', 'users.assign_role',
                    'roles.view', 'activity_log.view',
                    'catalog.view', 'catalog.manage',
                    'orders.view', 'orders.manage',
                    'content.manage',
                    'support.view', 'support.manage',
                ],
            ],
            [
                'slug' => Role::MANAGER,
                'name' => 'Manager',
                'level' => 50,
                'description' => 'Manages catalog, orders and content but cannot manage admin users.',
                'permissions' => [
                    'catalog.view', 'catalog.manage',
                    'orders.view', 'orders.manage',
                    'content.manage',
                    'support.view',
                ],
            ],
            [
                'slug' => Role::SUPPORT,
                'name' => 'Support',
                'level' => 20,
                'description' => 'Handles customer support tickets and can view orders to help customers.',
                'permissions' => [
                    'orders.view',
                    'support.view', 'support.manage',
                ],
            ],
        ];

        foreach ($roles as $roleData) {
            $role = Role::updateOrCreate(
                ['slug' => $roleData['slug']],
                [
                    'name' => $roleData['name'],
                    'level' => $roleData['level'],
                    'description' => $roleData['description'],
                ]
            );

            $ids = collect($roleData['permissions'])
                ->map(fn ($slug) => $permissionModels[$slug]->id)
                ->all();

            $role->permissions()->sync($ids);
        }
    }
}
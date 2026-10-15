<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            'users' => ['users.view' => 'View users', 'users.create' => 'Create users', 'users.update' => 'Update users', 'users.delete' => 'Delete users', 'users.assign_role' => 'Assign roles'],
            'roles' => ['roles.view' => 'View roles & permissions'],
            'activity_log' => ['activity_log.view' => 'View activity log'],
            'catalog' => ['catalog.view' => 'View catalog', 'catalog.manage' => 'Manage catalog'],
            'orders' => ['orders.view' => 'View orders', 'orders.manage' => 'Manage orders'],
            'content' => ['content.manage' => 'Manage blogs & pages'],
            'support' => ['support.view' => 'View support tickets', 'support.manage' => 'Handle support tickets'],
        ];

        $perm = [];
        foreach ($groups as $group => $items) {
            foreach ($items as $slug => $name) {
                $perm[$slug] = Permission::updateOrCreate(['slug' => $slug], ['name' => $name, 'group' => $group]);
            }
        }

        $roles = [
            [Role::SUPER_ADMIN, 'Super Admin', 100, 'Unrestricted access, including managing admins.', array_keys($perm)],
            [Role::ADMIN, 'Admin', 80, 'Runs operations: catalog, orders, content and staff below admin.', [
                'users.view', 'users.create', 'users.update', 'users.assign_role', 'roles.view', 'activity_log.view',
                'catalog.view', 'catalog.manage', 'orders.view', 'orders.manage', 'content.manage', 'support.view', 'support.manage',
            ]],
            [Role::MANAGER, 'Manager', 50, 'Manages catalog, orders and content.', [
                'catalog.view', 'catalog.manage', 'orders.view', 'orders.manage', 'content.manage', 'support.view',
            ]],
            [Role::SUPPORT, 'Support', 20, 'Handles customer support; can view orders.', [
                'orders.view', 'support.view', 'support.manage',
            ]],
        ];

        foreach ($roles as [$slug, $name, $level, $desc, $slugs]) {
            $role = Role::updateOrCreate(['slug' => $slug], ['name' => $name, 'level' => $level, 'description' => $desc]);
            $role->permissions()->sync(collect($slugs)->map(fn ($s) => $perm[$s]->id)->all());
        }
    }
}

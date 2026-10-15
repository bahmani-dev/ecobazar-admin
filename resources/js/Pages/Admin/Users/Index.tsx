import Badge from '@/Components/Admin/Badge';
import Pagination from '@/Components/Admin/Pagination';
import RoleBadge from '@/Components/Admin/RoleBadge';
import { usePermission } from '@/Hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { AdminUser, Paginated, Role } from '@/types/admin';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    users: Paginated<AdminUser>;
    roles: Pick<Role, 'id' | 'name' | 'slug'>[];
    filters: { search?: string; role?: string };
}

export default function Index({ users, roles, filters }: Props) {
    const { can } = usePermission();
    const [search, setSearch] = useState(filters.search ?? '');

    const apply = (next: Record<string, string | undefined>) =>
        router.get(route('admin.users.index'), { ...filters, ...next }, { preserveState: true, replace: true });

    const remove = (u: AdminUser) => {
        if (confirm(`Delete ${u.name}? This can't be undone.`)) {
            router.delete(route('admin.users.destroy', u.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Users">
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <form onSubmit={(e) => { e.preventDefault(); apply({ search: search || undefined }); }} className="flex gap-2">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name or email"
                        className="rounded-admin w-64 border border-admin-border px-3 py-2 text-sm"
                    />
                    <button className="rounded-admin border border-admin-border px-3 py-2 text-sm hover:bg-admin-panel">Search</button>
                </form>
                <select
                    value={filters.role ?? ''}
                    onChange={(e) => apply({ role: e.target.value || undefined })}
                    className="rounded-admin border border-admin-border px-3 py-2 text-sm"
                    aria-label="Filter by role"
                >
                    <option value="">All roles</option>
                    {roles.map((r) => <option key={r.id} value={r.slug}>{r.name}</option>)}
                </select>
                {can('users.create') && (
                    <Link href={route('admin.users.create')} className="rounded-admin ml-auto bg-admin-accent px-4 py-2 text-sm font-medium text-white hover:bg-admin-accentHover">
                        Add user
                    </Link>
                )}
            </div>

            <div className="rounded-admin overflow-x-auto border border-admin-border bg-admin-panel">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-admin-border text-admin-muted">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Last sign-in</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {users.data.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-admin-muted">No users match these filters.</td></tr>
                        )}
                        {users.data.map((u) => (
                            <tr key={u.id}>
                                <td className="px-4 py-3">
                                    <div className="font-medium">{u.name}</div>
                                    <div className="text-xs text-admin-muted">{u.email}</div>
                                </td>
                                <td className="px-4 py-3">
                                    {u.role ? <RoleBadge slug={u.role.slug} name={u.role.name} /> : <Badge>Customer</Badge>}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge tone={u.is_active ? 'accent' : 'neutral'}>{u.is_active ? 'Active' : 'Inactive'}</Badge>
                                </td>
                                <td className="px-4 py-3 text-admin-muted">
                                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}
                                </td>
                                <td className="space-x-3 px-4 py-3 text-right">
                                    {u.can.update && <Link href={route('admin.users.edit', u.id)} className="text-admin-accent hover:underline">Edit</Link>}
                                    {u.can.delete && <button onClick={() => remove(u)} className="text-admin-danger hover:underline">Delete</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination page={users} />
            </div>
        </AdminLayout>
    );
}

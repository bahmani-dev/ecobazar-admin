import RoleBadge from '@/Components/Admin/RoleBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { Permission, Role } from '@/types/admin';
import { Fragment } from 'react';

interface Props {
    roles: Role[];
    permissions: Record<string, Permission[]>;
}

export default function Index({ roles, permissions }: Props) {
    const has = (role: Role, slug: string) =>
        role.slug === 'super_admin' || role.permissions?.some((p) => p.slug === slug);

    return (
        <AdminLayout title="Roles & permissions">
            <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {roles.map((r) => (
                    <div key={r.id} className="rounded-admin border border-admin-border bg-admin-panel p-4">
                        <RoleBadge slug={r.slug} name={r.name} />
                        <p className="mt-2 text-sm text-admin-muted">{r.description}</p>
                        <p className="mt-2 text-xs text-admin-muted">{r.users_count} user{r.users_count === 1 ? '' : 's'}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-admin overflow-x-auto border border-admin-border bg-admin-panel">
                <table className="w-full text-sm">
                    <thead className="border-b border-admin-border text-left text-admin-muted">
                        <tr>
                            <th className="px-4 py-3 font-medium">Permission</th>
                            {roles.map((r) => <th key={r.id} className="px-4 py-3 text-center font-medium">{r.name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(permissions).map(([group, items]) => (
                            <Fragment key={group}>
                                <tr className="bg-admin-bg"><th colSpan={roles.length + 1} className="px-4 py-2 text-left text-xs font-semibold capitalize text-admin-muted">{group.replace('_', ' ')}</th></tr>
                                {items.map((p) => (
                                    <tr key={p.id} className="border-t border-admin-border">
                                        <td className="px-4 py-2.5">{p.name}</td>
                                        {roles.map((r) => (
                                            <td key={r.id} className="px-4 py-2.5 text-center">
                                                {has(r, p.slug)
                                                    ? <span aria-label="Allowed" className="text-admin-accent">✓</span>
                                                    : <span aria-label="Not allowed" className="text-admin-border">–</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

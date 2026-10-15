import AdminLayout from '@/Layouts/AdminLayout';
import { ActivityLogEntry } from '@/types/admin';

interface Props {
    stats: { total_users: number; active_users: number; staff_users: number; roles_count: number };
    recentActivity: ActivityLogEntry[];
}

export default function Dashboard({ stats, recentActivity }: Props) {
    const items = [
        ['Users', stats.total_users],
        ['Active users', stats.active_users],
        ['Staff accounts', stats.staff_users],
        ['Roles', stats.roles_count],
    ] as const;

    return (
        <AdminLayout title="Dashboard">
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {items.map(([label, value]) => (
                    <div key={label} className="rounded-admin border border-admin-border bg-admin-panel p-4">
                        <dt className="text-sm text-admin-muted">{label}</dt>
                        <dd className="mt-1 text-2xl font-semibold">{value}</dd>
                    </div>
                ))}
            </dl>

            <section className="rounded-admin mt-6 border border-admin-border bg-admin-panel">
                <h2 className="border-b border-admin-border px-4 py-3 text-sm font-semibold">Recent activity</h2>
                {recentActivity.length === 0 ? (
                    <p className="p-4 text-sm text-admin-muted">No activity recorded yet. Actions like creating or editing users will appear here.</p>
                ) : (
                    <ul className="divide-y divide-admin-border">
                        {recentActivity.map((l) => (
                            <li key={l.id} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                                <span>{l.description}</span>
                                <time className="shrink-0 text-admin-muted">{new Date(l.created_at).toLocaleString()}</time>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </AdminLayout>
    );
}

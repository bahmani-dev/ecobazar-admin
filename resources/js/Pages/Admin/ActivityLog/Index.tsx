import Badge, { Tone } from '@/Components/Admin/Badge';
import Pagination from '@/Components/Admin/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { ActivityLogEntry, Paginated } from '@/types/admin';
import { router } from '@inertiajs/react';

interface Props {
    logs: Paginated<ActivityLogEntry>;
    users: { id: number; name: string }[];
    actions: string[];
    filters: { user_id?: string; action?: string; from?: string; to?: string };
}

const actionTone: Record<string, Tone> = {
    created: 'accent', updated: 'info', deleted: 'danger', role_assigned: 'warn', login: 'neutral',
};

export default function Index({ logs, users, actions, filters }: Props) {
    const apply = (key: string, value: string) =>
        router.get(route('admin.activity-log.index'), { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });

    const input = 'rounded-admin border border-admin-border px-3 py-2 text-sm';

    return (
        <AdminLayout title="Activity log">
            <div className="mb-4 flex flex-wrap gap-2">
                <select aria-label="User" className={input} value={filters.user_id ?? ''} onChange={(e) => apply('user_id', e.target.value)}>
                    <option value="">All staff</option>
                    {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <select aria-label="Action" className={input} value={filters.action ?? ''} onChange={(e) => apply('action', e.target.value)}>
                    <option value="">All actions</option>
                    {actions.map((a) => <option key={a} value={a}>{a.replace('_', ' ')}</option>)}
                </select>
                <input aria-label="From date" type="date" className={input} value={filters.from ?? ''} onChange={(e) => apply('from', e.target.value)} />
                <input aria-label="To date" type="date" className={input} value={filters.to ?? ''} onChange={(e) => apply('to', e.target.value)} />
            </div>

            <div className="rounded-admin overflow-x-auto border border-admin-border bg-admin-panel">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-admin-border text-admin-muted">
                        <tr>
                            <th className="px-4 py-3 font-medium">When</th>
                            <th className="px-4 py-3 font-medium">Who</th>
                            <th className="px-4 py-3 font-medium">Action</th>
                            <th className="px-4 py-3 font-medium">Details</th>
                            <th className="px-4 py-3 font-medium">IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {logs.data.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-admin-muted">No activity matches these filters.</td></tr>
                        )}
                        {logs.data.map((l) => (
                            <tr key={l.id}>
                                <td className="whitespace-nowrap px-4 py-3 text-admin-muted">{new Date(l.created_at).toLocaleString()}</td>
                                <td className="px-4 py-3">{l.user?.name ?? 'System'}</td>
                                <td className="px-4 py-3"><Badge tone={actionTone[l.action] ?? 'neutral'}>{l.action.replace('_', ' ')}</Badge></td>
                                <td className="px-4 py-3">{l.description}</td>
                                <td className="px-4 py-3 text-admin-muted">{l.ip_address ?? '–'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination page={logs} />
            </div>
        </AdminLayout>
    );
}

import { Role } from '@/types/admin';
import { Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
    roles: Pick<Role, 'id' | 'name'>[];
    user?: { id: number; name: string; email: string; role_id: number | null; is_active: boolean };
    isSelf?: boolean;
}

export default function UserForm({ roles, user, isSelf = false }: Props) {
    const form = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        role_id: user?.role_id ?? (roles[roles.length - 1]?.id ?? ''),
        is_active: user?.is_active ?? true,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        user ? form.put(route('admin.users.update', user.id)) : form.post(route('admin.users.store'));
    };

    const field = 'rounded-admin mt-1 w-full border border-admin-border px-3 py-2 text-sm focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent';
    const err = (m?: string) => m && <p className="mt-1 text-xs text-admin-danger">{m}</p>;

    return (
        <form onSubmit={submit} className="rounded-admin max-w-xl space-y-4 border border-admin-border bg-admin-panel p-6">
            <label className="block text-sm font-medium">Name
                <input className={field} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                {err(form.errors.name)}
            </label>
            <label className="block text-sm font-medium">Email
                <input type="email" className={field} value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                {err(form.errors.email)}
            </label>
            <label className="block text-sm font-medium">Role
                <select className={field} value={form.data.role_id} disabled={isSelf} onChange={(e) => form.setData('role_id', Number(e.target.value))}>
                    {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                {isSelf && <p className="mt-1 text-xs text-admin-muted">You can't change your own role.</p>}
                {err(form.errors.role_id)}
            </label>
            <label className="block text-sm font-medium">{user ? 'New password (leave blank to keep current)' : 'Password'}
                <input type="password" className={field} value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} autoComplete="new-password" />
                {err(form.errors.password)}
            </label>
            <label className="block text-sm font-medium">Confirm password
                <input type="password" className={field} value={form.data.password_confirmation} onChange={(e) => form.setData('password_confirmation', e.target.value)} autoComplete="new-password" />
            </label>
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.data.is_active} disabled={isSelf} onChange={(e) => form.setData('is_active', e.target.checked)} />
                Account is active
            </label>

            <div className="flex gap-2 pt-2">
                <button disabled={form.processing} className="rounded-admin bg-admin-accent px-4 py-2 text-sm font-medium text-white hover:bg-admin-accentHover disabled:opacity-60">
                    {user ? 'Save changes' : 'Create user'}
                </button>
                <Link href={route('admin.users.index')} className="rounded-admin border border-admin-border px-4 py-2 text-sm hover:bg-admin-bg">Cancel</Link>
            </div>
        </form>
    );
}

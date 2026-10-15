import { usePermission } from '@/Hooks/usePermission';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import RoleBadge from './RoleBadge';

export default function Topbar({ children }: PropsWithChildren) {
    const { user } = usePermission();

    return (
        <header className="flex h-16 items-center justify-between border-b border-admin-border bg-admin-panel px-6">
            <h1 className="text-lg font-semibold text-admin-ink">{children}</h1>
            <div className="flex items-center gap-3">
                {user?.role && <RoleBadge slug={user.role.slug} name={user.role.name} />}
                <div className="text-right leading-tight">
                    <div className="text-sm font-medium text-admin-ink">{user?.name}</div>
                    <div className="text-xs text-admin-muted">{user?.email}</div>
                </div>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="rounded-admin border border-admin-border px-3 py-1.5 text-sm text-admin-muted hover:bg-admin-bg"
                >
                    Sign out
                </Link>
            </div>
        </header>
    );
}

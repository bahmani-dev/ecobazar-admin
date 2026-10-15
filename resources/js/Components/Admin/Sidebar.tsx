import { usePermission } from '@/Hooks/usePermission';
import { Link } from '@inertiajs/react';

const NAV = [
    { label: 'Dashboard', name: 'admin.dashboard', pattern: 'admin.dashboard' },
    { label: 'Users', name: 'admin.users.index', pattern: 'admin.users.*', permission: 'users.view' },
    { label: 'Roles & permissions', name: 'admin.roles.index', pattern: 'admin.roles.*', permission: 'roles.view' },
    { label: 'Activity log', name: 'admin.activity-log.index', pattern: 'admin.activity-log.*', permission: 'activity_log.view' },
];

export default function Sidebar() {
    const { can } = usePermission();

    return (
        <aside className="flex h-full w-60 shrink-0 flex-col bg-admin-sidebar text-admin-sidebarMuted">
            <div className="flex h-16 items-center px-6 text-[15px] font-semibold text-white">
                Ecobazar Admin
            </div>
            <nav className="flex-1 space-y-0.5 px-3 py-2">
                {NAV.filter((i) => !i.permission || can(i.permission)).map((item) => (
                    <Link
                        key={item.name}
                        href={route(item.name)}
                        className={`rounded-admin block px-3 py-2 text-sm transition-colors ${
                            route().current(item.pattern) ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

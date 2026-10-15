import { Link } from '@inertiajs/react';
import { Paginated } from '@/types/admin';

export default function Pagination<T>({ page }: { page: Paginated<T> }) {
    if (page.last_page <= 1) return null;

    return (
        <nav className="flex items-center justify-between border-t border-admin-border px-4 py-3 text-sm">
            <span className="text-admin-muted">{page.total} results</span>
            <div className="flex gap-1">
                {page.links.map((l, i) => {
                    const label = l.label.replace('&laquo;', '‹').replace('&raquo;', '›');
                    const cls = `rounded-admin px-2.5 py-1 ${
                        l.active ? 'bg-admin-accent text-white' : 'text-admin-ink hover:bg-admin-bg'
                    } ${!l.url ? 'pointer-events-none opacity-40' : ''}`;
                    return l.url ? (
                        <Link key={i} href={l.url} className={cls} preserveScroll>{label}</Link>
                    ) : (
                        <span key={i} className={cls}>{label}</span>
                    );
                })}
            </div>
        </nav>
    );
}

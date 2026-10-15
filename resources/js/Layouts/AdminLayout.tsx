import Sidebar from '@/Components/Admin/Sidebar';
import Topbar from '@/Components/Admin/Topbar';
import { SharedPageProps } from '@/types/admin';
import { Head, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function AdminLayout({
    title,
    children,
}: PropsWithChildren<{ title: string }>) {
    const { flash } = usePage<SharedPageProps>().props;
    const notice = flash.success
        ? { ok: true, text: flash.success }
        : flash.error
          ? { ok: false, text: flash.error }
          : null;

    return (
        <div className="bg-admin-bg text-admin-ink flex h-screen">
            <Head title={`${title} · Admin`} />
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar>{title}</Topbar>
                {notice && (
                    <div
                        role="status"
                        className={`rounded-admin mx-6 mt-4 px-4 py-2.5 text-sm ${
                            notice.ok
                                ? 'bg-admin-accentSoft text-admin-accent'
                                : 'bg-admin-dangerSoft text-admin-danger'
                        }`}
                    >
                        {notice.text}
                    </div>
                )}
                <main className="flex-1 overflow-y-auto px-6 py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

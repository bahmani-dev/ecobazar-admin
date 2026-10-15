import { SharedPageProps } from '@/types/admin';
import { usePage } from '@inertiajs/react';

/**
 * UI-only checks (hide/show nav and buttons). The server-side `permission:`
 * middleware and Policies remain the real authorization boundary.
 */
export function usePermission() {
    const { auth } = usePage<SharedPageProps>().props;
    const permissions = auth.user?.permissions ?? [];
    const role = auth.user?.role ?? null;

    const can = (permission: string): boolean =>
        permissions.includes('*') || permissions.includes(permission);

    const hasRole = (slug: string | string[]): boolean =>
        !!role &&
        (Array.isArray(slug) ? slug.includes(role.slug) : role.slug === slug);

    return { can, hasRole, role, user: auth.user };
}

import { PageProps } from '@/types';

export interface Role {
    id: number;
    slug: string;
    name: string;
    level: number;
    description?: string | null;
    users_count?: number;
    permissions?: { id: number; slug: string }[];
}

export interface Permission {
    id: number;
    slug: string;
    name: string;
    group: string;
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    last_login_at: string | null;
    role: Pick<Role, 'id' | 'name' | 'slug'> | null;
    can: { update: boolean; delete: boolean };
}

export interface ActivityLogEntry {
    id: number;
    action: string;
    description: string;
    ip_address: string | null;
    created_at: string;
    properties: Record<string, unknown> | null;
    user: { id: number; name: string; email: string } | null;
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: { slug: string; name: string; level: number } | null;
    permissions: string[]; // ['*'] = all permissions (super admin)
}

/**
 * Built on the project's own PageProps (it carries `ziggy`), so it satisfies
 * usePage<T>()'s constraint. `auth` is omitted first because the admin area
 * shares a richer user (role + permissions) than the default.
 */
export type SharedPageProps = Omit<PageProps, 'auth'> & {
    auth: { user: AuthUser | null };
    flash: { success?: string | null; error?: string | null };
};

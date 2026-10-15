import Badge, { Tone } from './Badge';

const roleTone: Record<string, Tone> = {
    super_admin: 'danger',
    admin: 'accent',
    manager: 'info',
    support: 'warn',
};

export default function RoleBadge({ slug, name }: { slug: string; name: string }) {
    return <Badge tone={roleTone[slug] ?? 'neutral'}>{name}</Badge>;
}

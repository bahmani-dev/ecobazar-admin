import AdminLayout from '@/Layouts/AdminLayout';
import { Role } from '@/types/admin';
import UserForm from './UserForm';

interface Props {
    user: { id: number; name: string; email: string; role_id: number | null; is_active: boolean };
    roles: Role[];
    isSelf: boolean;
}

export default function Edit({ user, roles, isSelf }: Props) {
    return (
        <AdminLayout title={`Edit ${user.name}`}>
            <UserForm user={user} roles={roles} isSelf={isSelf} />
        </AdminLayout>
    );
}

import AdminLayout from '@/Layouts/AdminLayout';
import { Role } from '@/types/admin';
import UserForm from './UserForm';

export default function Create({ roles }: { roles: Role[] }) {
    return (
        <AdminLayout title="Create user">
            <UserForm roles={roles} />
        </AdminLayout>
    );
}

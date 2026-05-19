import { useState } from 'react';
import { useNavigate } from 'react-router';
import UserForm from './components/UserForm';
import { userApi } from '../../api/user';
import type { User } from '../../types/user';
import toast from 'react-hot-toast';

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      await userApi.createUser(data);
      toast.success('User created successfully');
      navigate('/users');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create User</h1>
        <p className="text-slate-500">Add a new user to the system.</p>
      </div>

      <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

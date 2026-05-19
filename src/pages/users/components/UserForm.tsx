import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { User } from '../../../types/user';
import { Input } from '../../../components/common/Input';
import { SwitchButton } from '../../../components/common/SwitchButton';
import { CustomButton } from '../../../components/common/CustomButton';
import toast from 'react-hot-toast';

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
}

const ROLES = ['Admin', 'Customer', 'Manager'];

export default function UserForm({ initialData, onSubmit, isLoading, isEdit = false }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({
    username: '',
    email: '',
    full_name: '',
    roles: ['Customer'],
    is_active: true,
    ...initialData,
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const passwordMismatch = !isEdit && confirmPassword !== '' && formData.password !== confirmPassword;

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'is_active') {
        setFormData({ ...formData, [name]: checked });
      } else {
        // Handle roles checkbox
        const currentRoles = formData.roles || [];
        if (checked) {
          setFormData({ ...formData, roles: [...currentRoles, value] });
        } else {
          setFormData({ ...formData, roles: currentRoles.filter((r) => r !== value) });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEdit && formData.password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Username *"
          type="text"
          name="username"
          value={formData.username || ''}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Email *"
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          required
        />

        {!isEdit && (
          <>
            <Input
              label="Password *"
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              required={!isEdit}
            />
            <Input
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!isEdit}
              error={passwordMismatch ? 'Passwords do not match' : undefined}
            />
          </>
        )}

        <Input
          label="Full Name"
          type="text"
          name="full_name"
          value={formData.full_name || ''}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Roles</label>
        <div className="flex flex-wrap gap-4">
          {ROLES.map((role) => (
            <label key={role} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="roles"
                value={role}
                checked={(formData.roles || []).includes(role)}
                onChange={handleChange}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <SwitchButton
          name="is_active"
          checked={!!formData.is_active}
          onChange={handleChange}
          label="Active"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <CustomButton variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </CustomButton>
        <CustomButton type="submit" disabled={isLoading || passwordMismatch}>
          {isLoading ? 'Saving...' : 'Save User'}
        </CustomButton>
      </div>
    </form>
  );
}

import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Category } from '../../../types/category';
import { Input } from '../../../components/common/Input';
import { SwitchButton } from '../../../components/common/SwitchButton';
import { CustomButton } from '../../../components/common/CustomButton';

interface CategoryFormProps {
  initialData?: Partial<Category>;
  onSubmit: (data: Partial<Category>) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
}

export default function CategoryForm({ initialData, onSubmit, isLoading, isEdit = false }: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    code: '',
    is_active: true,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Name *"
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Code *"
          type="text"
          name="code"
          value={formData.code || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className="pt-2">
        <SwitchButton
          name="is_active"
          checked={!!formData.is_active}
          onChange={(e) => handleSwitchChange('is_active', e.target.checked)}
          label="Active"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <CustomButton variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </CustomButton>
        <CustomButton type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
        </CustomButton>
      </div>
    </form>
  );
}

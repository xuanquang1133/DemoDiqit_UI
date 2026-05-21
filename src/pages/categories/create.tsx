import { useState } from 'react';
import { useNavigate } from 'react-router';
import CategoryForm from './components/CategoryForm';
import { categoryApi } from '../../api/category';
import type { Category } from '../../types/category';
import toast from 'react-hot-toast';

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Partial<Category>) => {
    setIsLoading(true);
    try {
      await categoryApi.createCategory(data);
      toast.success('Category created successfully');
      navigate('/categories');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create Category</h1>
        <p className="text-slate-500">Add a new category to the system.</p>
      </div>

      <CategoryForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router';
import { categoryApi } from '../../api/category';
import type { Category } from '../../types/category';
import type { PaginatedData } from '../../types/common';
import { EditIcon } from '../../components/icons/EditIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { SwitchButton } from '../../components/common/SwitchButton';
import { CustomButton } from '../../components/common/CustomButton';
import { STATUS_FILTER_OPTIONS } from '../../constants';
import toast from 'react-hot-toast';

export default function CategoryListPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<PaginatedData<Category> | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({
    keyword: '',
    status: 'All',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (prev.keyword === keyword) return prev;
        return { ...prev, keyword, page: 1 };
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: filters.page,
        limit: filters.limit,
        keyword: filters.keyword,
      };
      if (filters.status !== 'All') {
        params.is_active = filters.status === 'active';
      }
      const res = await categoryApi.getCategories(params);
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || !data || newPage > data.total_pages) return;
    setFilters({ ...filters, page: newPage });
  };

  const handleStatusToggle = async (category: Category) => {
    try {
      await categoryApi.updateStatus(category.id, !category.is_active);
      // Optimistic update
      if (data) {
        setData({
          ...data,
          items: data.items.map((c) => (c.id === category.id ? { ...c, is_active: !c.is_active } : c)),
        });
      }
      toast.success('Status updated successfully');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to update status';
      toast.error(msg);
      console.error('Failed to update status', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryApi.deleteCategory(id);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Failed to delete category';
        toast.error(msg);
        console.error('Failed to delete category', error);
      }
    }
  };

  const renderStatusSwitch = (category: Category) => {
    return (
      <SwitchButton 
        checked={category.is_active}
        onChange={() => handleStatusToggle(category)}
      />
    );
  };

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50/50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories Management</h1>
          <p className="text-sm text-slate-500 mt-1">Total: {data?.total || 0} categories</p>
        </div>
        <CustomButton onClick={() => navigate('/categories/create')}>
          <PlusIcon size={18} />
          Add Category
        </CustomButton>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Filter Section */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <SearchIcon size={16} />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by name / code..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[120px]"
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Loading categories...
                  </td>
                </tr>
              ) : data?.items?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                data?.items?.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">#{category.id.toString().padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{category.code}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {renderStatusSwitch(category)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(category.created_at).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-3">
                        <CustomButton
                          variant="ghost"
                          className="!px-2 !py-1"
                          onClick={() => navigate(`/categories/update/${category.id}`)}
                        >
                          <EditIcon size={16} /> Edit
                        </CustomButton>
                        <CustomButton
                          variant="danger"
                          className="!px-2 !py-1"
                          onClick={() => handleDelete(category.id)}
                        >
                          <TrashIcon size={16} /> Delete
                        </CustomButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {data && data.total_pages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {(data.page - 1) * data.limit + 1}-{Math.min(data.page * data.limit, data.total)} of {data.total}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={data.page === 1}
                onClick={() => handlePageChange(data.page - 1)}
                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-50"
              >
                &lt;
              </button>
              {Array.from({ length: Math.min(5, data.total_pages) }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                      data.page === pageNum
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {data.total_pages > 5 && <span className="text-slate-400 px-1">...</span>}
              {data.total_pages > 5 && (
                <button
                  onClick={() => handlePageChange(data.total_pages)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                    data.page === data.total_pages
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {data.total_pages}
                </button>
              )}
              <button
                disabled={data.page === data.total_pages}
                onClick={() => handlePageChange(data.page + 1)}
                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

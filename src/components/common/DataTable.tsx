import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: T) => ReactNode;
  /** Hide this column on screens smaller than the breakpoint. e.g. "sm" hides on mobile, "md" hides on tablet */
  hideBelow?: "sm" | "md";
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (item: T) => string | number;
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  loadingMessage = "Loading...",
  emptyMessage = "No data found.",
  onRowClick,
  actions,
  className = "",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500"
                  >
                    {col.header}
                  </th>
                ))}
                {actions && (
                  <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-right text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-3 sm:px-4 py-8 sm:py-12 text-center text-xs sm:text-sm text-slate-500"
                >
                  {loadingMessage}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={
                    col.hideBelow === "sm"
                      ? "hidden sm:table-cell px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500"
                      : col.hideBelow === "md"
                      ? "hidden md:table-cell px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500"
                      : "px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500"
                  }
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-right text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-3 sm:px-4 py-8 sm:py-12 text-center text-xs sm:text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={rowKey(item)}
                  onClick={() => onRowClick?.(item)}
                  className={
                    onRowClick ? "hover:bg-slate-50 cursor-pointer transition-colors" : "hover:bg-slate-50 transition-colors"
                  }
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={
                        col.hideBelow === "sm"
                          ? "hidden sm:table-cell px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-600 whitespace-nowrap"
                          : col.hideBelow === "md"
                          ? "hidden md:table-cell px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-600 whitespace-nowrap"
                          : "px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-600 whitespace-nowrap"
                      }
                      style={{ textAlign: col.align }}
                    >
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

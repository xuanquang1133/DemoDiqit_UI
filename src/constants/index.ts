export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: "All", label: "Status: All" },
  ...STATUS_OPTIONS,
];
export const ROLE_OPTIONS = ["Admin", "Customer", "Manager"];

export const ROLE_FILTER_OPTIONS = [
  { value: "All", label: "Role: All" },
  ...ROLE_OPTIONS.map((role) => ({ value: role, label: role })),
];

// Order status constants
export const ORDER_STATUS_PENDING = "pending";
export const ORDER_STATUS_PROCESSING = "processing";
export const ORDER_STATUS_COMPLETED = "completed";
export const ORDER_STATUS_CANCELLED = "cancelled";

export const ORDER_STATUS_OPTIONS = [
  { value: ORDER_STATUS_PENDING, label: "Pending" },
  { value: ORDER_STATUS_PROCESSING, label: "Processing" },
  { value: ORDER_STATUS_COMPLETED, label: "Completed" },
  { value: ORDER_STATUS_CANCELLED, label: "Cancelled" },
];

export const ORDER_STATUS_FILTER_OPTIONS = [
  { value: "All", label: "Status: All" },
  ...ORDER_STATUS_OPTIONS,
];

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

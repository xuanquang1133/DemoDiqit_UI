import { useNavigate } from "react-router";

interface AddButtonProps {
  label?: string;
  navigateTo: string;
  className?: string;
}

export const AddButton = ({
  label = "Add",
  navigateTo,
  className = "",
}: AddButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(navigateTo)}
      className={`flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 ${className}`}
    >
      <span>+</span>
      <span>{label}</span>
    </button>
  );
};

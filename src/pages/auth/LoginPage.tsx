import { FormEvent, useState } from "react";

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field: keyof LoginForm, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    setMessage("");
  };

  const validateForm = () => {
    const newErrors: LoginErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống.";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống.";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setMessage("Form hợp lệ. Chờ tích hợp API đăng nhập ở bước sau.");
    console.log("Login form data:", form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
            D
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your store
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="admin@example.com"
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-900"
                }`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="flex overflow-hidden rounded-xl border border-slate-300 focus-within:border-slate-900">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="border-l border-slate-300 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="mt-2 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => handleChange("remember", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Remember me
            </label>

            <button
              type="button"
              className="font-medium text-slate-900 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Login
          </button>
        </form>

        {message && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          DP-84: UI login page completed, waiting for API integration.
        </p>
      </div>
    </div>
  );
}
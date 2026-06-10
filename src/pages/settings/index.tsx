// Settings page
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userApi } from "../../api/user";
import { changePassword } from "../../api/auth/changePassword";
import toast from "react-hot-toast";
import {
  UserIcon,
  EyeIcon,
  SpinnerIcon,
  SettingsIcon,
} from "../../components/icons";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">("profile");

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSecuritySaving, setIsSecuritySaving] = useState(false);

  // Preferences Form State
  const [defaultLimit, setDefaultLimit] = useState(10);
  const [toastNotify, setToastNotify] = useState(true);
  const [soundAlert, setSoundAlert] = useState(false);
  const [appTheme, setAppTheme] = useState("indigo");

  // Load state on mount
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    const savedLimit = localStorage.getItem("default_limit");
    if (savedLimit) setDefaultLimit(Number(savedLimit));

    const savedToast = localStorage.getItem("toast_notify");
    if (savedToast !== null) setToastNotify(savedToast === "true");

    const savedSound = localStorage.getItem("sound_alert");
    if (savedSound !== null) setSoundAlert(savedSound === "true");

    const savedTheme = localStorage.getItem("app_theme");
    if (savedTheme) setAppTheme(savedTheme);
  }, []);

  // Password strength logic
  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: "None", color: "bg-slate-200" };
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score <= 1) return { score, label: "Yếu", color: "bg-red-500", text: "text-red-500" };
    if (score === 2 || score === 3) return { score, label: "Trung bình", color: "bg-amber-500", text: "text-amber-500" };
    return { score, label: "Mạnh", color: "bg-emerald-500", text: "text-emerald-500" };
  };

  const strength = getPasswordStrength();

  // Handle Profile Update
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!fullName.trim() || !email.trim()) {
      toast.error("Vui lòng điền đầy đủ họ tên và email!");
      return;
    }

    setIsProfileSaving(true);
    try {
      const res = await userApi.updateUser(user.id, {
        username: user.username,
        full_name: fullName,
        email: email,
        roles: user.roles,
        is_active: true,
      });

      if (res.data) {
        setUser({
          ...user,
          full_name: res.data.full_name,
          email: res.data.email,
        });
        toast.success("Cập nhật thông tin cá nhân thành công!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật profile.");
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Handle Security Update
  const handleSecuritySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải từ 6 ký tự trở lên!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không trùng khớp!");
      return;
    }

    setIsSecuritySaving(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Thay đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Mật khẩu hiện tại không đúng.");
    } finally {
      setIsSecuritySaving(false);
    }
  };

  // Handle Preferences Save
  const handlePreferencesSave = () => {
    localStorage.setItem("default_limit", String(defaultLimit));
    localStorage.setItem("toast_notify", String(toastNotify));
    localStorage.setItem("sound_alert", String(soundAlert));
    localStorage.setItem("app_theme", appTheme);
    toast.success("Đã lưu các tùy chọn hiển thị & hệ thống!");
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header section */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Cài đặt hệ thống</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Quản lý tài khoản cá nhân, cấu hình bảo mật và tùy chỉnh giao diện Dashboard.
          </p>
        </div>
        <div className="hidden sm:block">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
            <SettingsIcon size={14} className="text-slate-400" /> Bản phát hành v1.0
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1">
          <nav className="flex flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-1.5">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === "profile"
                  ? "bg-slate-950 text-white shadow-md shadow-slate-900/10"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <UserIcon size={16} />
              <span>Tài khoản</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === "security"
                  ? "bg-slate-950 text-white shadow-md shadow-slate-900/10"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Bảo mật</span>
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === "preferences"
                  ? "bg-slate-950 text-white shadow-md shadow-slate-900/10"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <span>Tùy chọn</span>
            </button>
          </nav>
        </div>

        {/* Tab content wrapper */}
        <div className="md:col-span-3">
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div>
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-950">Thông tin tài khoản</h2>
                  <p className="text-sm text-slate-500">Cập nhật thông tin cá nhân của bạn trên hệ thống.</p>
                </div>

                <div className="mb-6 flex flex-col items-center gap-4 border-b border-slate-100 pb-6 sm:flex-row">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-extrabold text-white shadow-inner">
                    {user?.username?.substring(0, 2).toUpperCase() || "US"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{fullName || user?.username}</h3>
                    <p className="text-sm text-slate-500">
                      Tài khoản của bạn được gán quyền quản trị thuộc nhóm:
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {user?.roles?.map((role) => (
                        <span
                          key={role}
                          className="inline-block rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs font-semibold text-blue-700 uppercase tracking-wider"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
                        Tên tài khoản (username)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={user?.username || ""}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed focus:outline-none"
                      />
                      <span className="mt-1 block text-xs text-slate-400">Username không thể thay đổi.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
                        Họ và Tên
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nhập họ và tên..."
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ten@viethan.vn"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                      required
                    />
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isProfileSaving}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-900 active:scale-95 transition-all cursor-pointer"
                    >
                      {isProfileSaving ? (
                        <>
                          <SpinnerIcon size={16} className="animate-spin text-white" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <span>Lưu thay đổi</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div>
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-950">Mật khẩu & Bảo mật</h2>
                  <p className="text-sm text-slate-500">Đổi mật khẩu định kỳ để tăng cường bảo vệ tài khoản.</p>
                </div>

                <form onSubmit={handleSecuritySave} className="space-y-5">
                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-slate-200 pl-4 pr-11 py-2.5 text-sm text-slate-800 transition-colors focus:border-slate-800 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        <EyeIcon size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-slate-200 pl-4 pr-11 py-2.5 text-sm text-slate-800 transition-colors focus:border-slate-800 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        <EyeIcon size={18} />
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500">Độ mạnh mật khẩu:</span>
                          <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full transition-all duration-300 ${strength.color}`}
                            style={{ width: `${(strength.score / 4) * 100}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400">
                          Mật khẩu nên chứa cả chữ hoa, chữ thường, số và ký tự đặc biệt.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-slate-200 pl-4 pr-11 py-2.5 text-sm text-slate-800 transition-colors focus:border-slate-800 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        <EyeIcon size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSecuritySaving}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-900 active:scale-95 transition-all cursor-pointer"
                    >
                      {isSecuritySaving ? (
                        <>
                          <SpinnerIcon size={16} className="animate-spin text-white" />
                          <span>Đang cập nhật...</span>
                        </>
                      ) : (
                        <span>Đổi mật khẩu</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === "preferences" && (
              <div>
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-950">Tùy chọn hiển thị & Cấu hình</h2>
                  <p className="text-sm text-slate-500">
                    Cá nhân hóa trải nghiệm quản lý hệ thống CMS.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Items Limit */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
                      Số lượng bản ghi mặc định trên mỗi trang
                    </label>
                    <select
                      value={defaultLimit}
                      onChange={(e) => setDefaultLimit(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-white transition-colors focus:border-slate-800 focus:outline-none"
                    >
                      <option value={5}>5 bản ghi</option>
                      <option value={10}>10 bản ghi</option>
                      <option value={20}>20 bản ghi</option>
                      <option value={50}>50 bản ghi</option>
                      <option value={100}>100 bản ghi</option>
                    </select>
                    <p className="mt-1 text-xs text-slate-400">
                      Cài đặt này sẽ áp dụng cho tất cả bảng danh sách (Sản phẩm, Người dùng, Đơn hàng...).
                    </p>
                  </div>

                  {/* Toggle switches for System status alerts */}
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700 mb-4">
                      Thông báo & Âm thanh
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Thông báo nổi (Toast Notification)</p>
                          <p className="text-xs text-slate-500">Hiển thị thông báo góc trên bên phải khi có thao tác mới.</p>
                        </div>
                        <button
                          onClick={() => setToastNotify(!toastNotify)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            toastNotify ? "bg-slate-950" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              toastNotify ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Âm thanh cảnh báo</p>
                          <p className="text-xs text-slate-500">Phát âm thanh nhỏ khi có đơn hàng mới phát sinh.</p>
                        </div>
                        <button
                          onClick={() => setSoundAlert(!soundAlert)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            soundAlert ? "bg-slate-950" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              soundAlert ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Themes selection */}
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700 mb-3">
                      Bảng màu chủ đạo Dashboard
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "indigo", name: "Midnight Indigo", bg: "bg-indigo-600" },
                        { id: "slate", name: "Dark Slate", bg: "bg-slate-900" },
                        { id: "teal", name: "Emerald Teal", bg: "bg-teal-600" },
                      ].map((theme) => {
                        const isSelected = appTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setAppTheme(theme.id);
                              document.documentElement.setAttribute("data-theme", theme.id);
                            }}
                            className={`flex flex-col items-center gap-2 rounded-lg border p-3.5 transition-all hover:bg-slate-50 ${
                              isSelected ? "border-slate-900 bg-slate-50/70 ring-1 ring-slate-900" : "border-slate-200 bg-white"
                            }`}
                          >
                            <span className={`h-6 w-6 rounded-full shadow-sm ${theme.bg}`} />
                            <span className="text-xs font-medium text-slate-800">{theme.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={handlePreferencesSave}
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-900 active:scale-95 transition-all cursor-pointer"
                    >
                      Lưu tùy chọn
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

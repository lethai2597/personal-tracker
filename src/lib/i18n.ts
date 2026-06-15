export type Locale = "en" | "vi";

export const LOCALES: Locale[] = ["en", "vi"];

export const messages = {
  en: {
    nav: { dashboard: "Dashboard", login: "Log in", register: "Create account", account: "Account" },
    landing: {
      eyebrow: "Private daily dashboard",
      title: "Personal Tracker",
      subtitle:
        "A focused workspace for tasks, notes, bookmarks, habits, and Pomodoro sessions, now backed by private account data.",
      primary: "Open dashboard",
      secondary: "Create account",
      sections: ["Plan the day", "Keep useful links", "Build steady habits"],
      body: [
        "Move tasks between backlog, todo, doing, and done without leaving the board.",
        "Save notes and grouped bookmarks alongside the work they support.",
        "Track daily completions and keep momentum visible at a glance.",
      ],
    },
    auth: {
      loginTitle: "Log in",
      registerTitle: "Create account",
      email: "Email",
      password: "Password",
      name: "Name",
      submitLogin: "Log in",
      submitRegister: "Create account",
      forgot: "Forgot password?",
      resetTitle: "Reset password",
      requestReset: "Send reset link",
      newPassword: "New password",
      changePassword: "Change password",
      currentPassword: "Current password",
      profile: "Profile",
      logout: "Log out",
      devResetLinks: "Development reset links",
    },
  },
  vi: {
    nav: { dashboard: "Dashboard", login: "Đăng nhập", register: "Tạo tài khoản", account: "Tài khoản" },
    landing: {
      eyebrow: "Dashboard cá nhân riêng tư",
      title: "Personal Tracker",
      subtitle:
        "Không gian tập trung cho task, ghi chú, bookmark, thói quen và Pomodoro, nay lưu theo tài khoản riêng.",
      primary: "Mở dashboard",
      secondary: "Tạo tài khoản",
      sections: ["Lên kế hoạch ngày", "Giữ link hữu ích", "Duy trì thói quen"],
      body: [
        "Kéo task qua backlog, todo, doing và done ngay trên board.",
        "Lưu ghi chú và bookmark theo nhóm cạnh những việc đang làm.",
        "Theo dõi hoàn thành mỗi ngày và nhìn thấy nhịp tiến bộ tức thì.",
      ],
    },
    auth: {
      loginTitle: "Đăng nhập",
      registerTitle: "Tạo tài khoản",
      email: "Email",
      password: "Mật khẩu",
      name: "Tên",
      submitLogin: "Đăng nhập",
      submitRegister: "Tạo tài khoản",
      forgot: "Quên mật khẩu?",
      resetTitle: "Đặt lại mật khẩu",
      requestReset: "Gửi link đặt lại",
      newPassword: "Mật khẩu mới",
      changePassword: "Đổi mật khẩu",
      currentPassword: "Mật khẩu hiện tại",
      profile: "Hồ sơ",
      logout: "Đăng xuất",
      devResetLinks: "Link đặt lại trong môi trường dev",
    },
  },
} as const;

export function normalizeLocale(value: string | undefined | null): Locale {
  return value?.toLowerCase().startsWith("vi") ? "vi" : "en";
}

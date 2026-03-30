import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import usePageMeta from "../hooks/usePageMeta";
import { getApiErrorMessage } from "../utils/apiError";

function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, setUserInfo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/";

  const redirectNotice = useMemo(() => {
    if (redirect === "/" || !redirect) {
      return "Đăng nhập để lưu giỏ hàng, theo dõi đơn và quay lại mua nhanh hơn ở những lần sau.";
    }

    return "Bạn cần đăng nhập để tiếp tục bước mua hàng đang dang dở. Sau khi xác thực xong, hệ thống sẽ đưa bạn quay lại đúng màn hình trước đó.";
  }, [redirect]);

  usePageMeta({
    title: "Đăng nhập",
    description:
      "Đăng nhập để theo dõi đơn hàng, lưu giỏ hàng và tiếp tục checkout trên ShoeStore.",
  });

  useEffect(() => {
    if (userInfo?.token) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axiosClient.post("/users/login", {
        email,
        password,
      });

      setUserInfo(response.data.data);
      navigate(redirect);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Đăng nhập để tiếp tục mua hàng"
      description="Một màn hình đăng nhập tốt phải rõ, nhẹ và giúp shopper quay lại flow mua hàng ngay lập tức. Vì vậy form được giữ ngắn, CTA rõ và trust/support đặt ngay bên cạnh."
      redirectNotice={redirectNotice}
      sidebarTitle="Tài khoản giúp bạn mua nhanh hơn"
      sidebarDescription="Sau khi đăng nhập, bạn có thể tiếp tục checkout, xem lại đơn hàng trước đó và lưu thông tin mua sắm cho những lần tiếp theo."
    >
      <form className="space-y-5" onSubmit={submitHandler}>
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="login-email" className="label-field">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ban@example.com"
            className="input-field"
            autoComplete="email"
            aria-describedby="login-email-help"
            required
          />
          <p id="login-email-help" className="mt-2 text-xs leading-6 text-slate-500">
            Dùng email đã đăng ký để tiếp tục checkout và theo dõi đơn hàng.
          </p>
        </div>

        <div>
          <label htmlFor="login-password" className="label-field">
            Mật khẩu
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nhập mật khẩu của bạn"
            className="input-field"
            autoComplete="current-password"
            aria-describedby="login-password-help"
            required
          />
          <p id="login-password-help" className="mt-2 text-xs leading-6 text-slate-500">
            Nếu bạn vừa quay lại từ checkout, hệ thống sẽ giữ nguyên hướng điều hướng sau khi đăng nhập thành công.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-4 text-base"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

        <p className="text-center text-sm leading-6 text-slate-600">
          Chưa có tài khoản?{" "}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-orange-600 hover:text-orange-500"
          >
            Tạo tài khoản mới
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginScreen;
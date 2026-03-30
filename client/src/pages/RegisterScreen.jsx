import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import usePageMeta from "../hooks/usePageMeta";
import { getApiErrorMessage } from "../utils/apiError";

function RegisterScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, setUserInfo } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/";

  const redirectNotice = useMemo(() => {
    if (redirect === "/" || !redirect) {
      return "Tạo tài khoản để lưu thông tin giao hàng, theo dõi đơn và quay lại mua nhanh hơn trong những lần tiếp theo.";
    }

    return "Bạn đang ở giữa flow mua hàng. Sau khi tạo tài khoản xong, hệ thống sẽ đưa bạn quay lại đúng bước để tiếp tục checkout.";
  }, [redirect]);

  usePageMeta({
    title: "Đăng ký",
    description:
      "Tạo tài khoản ShoeStore để lưu thông tin giao hàng, theo dõi đơn và checkout nhanh hơn.",
  });

  useEffect(() => {
    if (userInfo?.token) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axiosClient.post("/users", {
        name,
        email,
        password,
      });

      setUserInfo(response.data.data);
      navigate(redirect);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Đăng ký thất bại. Vui lòng thử lại.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Tạo tài khoản để mua nhanh và theo dõi đơn dễ hơn"
      description="Form đăng ký được giữ ngắn gọn để shopper không bị rời mạch mua hàng. Chỉ cần vài thông tin cơ bản là bạn có thể lưu giỏ hàng và tiếp tục checkout."
      redirectNotice={redirectNotice}
      sidebarTitle="Một tài khoản, nhiều lợi ích mua hàng"
      sidebarDescription="Tài khoản giúp lưu thông tin mua sắm, giảm thời gian nhập lại form ở checkout và dễ theo dõi trạng thái đơn sau khi đặt hàng."
    >
      <form className="space-y-5" onSubmit={submitHandler}>
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="register-name" className="label-field">
            Họ và tên
          </label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nguyễn Văn A"
            className="input-field"
            autoComplete="name"
            aria-describedby="register-name-help"
            required
          />
          <p id="register-name-help" className="mt-2 text-xs leading-6 text-slate-500">
            Tên này sẽ được dùng trong phần xác nhận đơn hàng và hỗ trợ sau mua.
          </p>
        </div>

        <div>
          <label htmlFor="register-email" className="label-field">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ban@example.com"
            className="input-field"
            autoComplete="email"
            aria-describedby="register-email-help"
            required
          />
          <p id="register-email-help" className="mt-2 text-xs leading-6 text-slate-500">
            Chúng tôi dùng email này để nhận diện tài khoản và hỗ trợ bạn tra cứu đơn hàng.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="register-password" className="label-field">
              Mật khẩu
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="input-field"
              autoComplete="new-password"
              aria-describedby="register-password-help"
              required
            />
            <p id="register-password-help" className="mt-2 text-xs leading-6 text-slate-500">
              Chọn mật khẩu dễ nhớ với bạn nhưng đủ an toàn cho tài khoản.
            </p>
          </div>

          <div>
            <label htmlFor="register-confirm-password" className="label-field">
              Xác nhận mật khẩu
            </label>
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="input-field"
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-4 text-base"
        >
          {loading ? "Đang xử lý..." : "Tạo tài khoản"}
        </button>

        <p className="text-center text-sm leading-6 text-slate-600">
          Đã có tài khoản?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-orange-600 hover:text-orange-500"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterScreen;
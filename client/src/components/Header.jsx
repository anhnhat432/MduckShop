import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";

function Header() {
  const location = useLocation();
  const { userInfo, logout } = useAuth();
  const { cart } = useStore();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartQuantity = useMemo(
    () =>
      (cart.cartItems || []).reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
      ),
    [cart.cartItems]
  );

  useEffect(() => {
    setAdminMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/30 bg-slate-950 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/70 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <p>Miễn phí giao hàng cho đơn từ 2.000.000đ</p>
          <p className="hidden sm:block">Đổi size 7 ngày • Hỗ trợ COD toàn quốc</p>
        </div>
      </div>

      <div
        className={`border-b border-slate-200/80 bg-white/88 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "shadow-soft" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-slate-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-soft">
              SS
            </span>
            <div>
              <p className="font-display text-lg font-extrabold tracking-tight">ShoeStore</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
                Premium Sneaker Store
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive("/")
                  ? "bg-slate-100 text-slate-950"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/products"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive("/products") || isActive("/product")
                  ? "bg-slate-100 text-slate-950"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              Sản phẩm
            </Link>
            <Link
              to="/cart"
              aria-label={`Mở giỏ hàng, hiện có ${cartQuantity} sản phẩm`}
              className="relative ml-2 rounded-full p-2.5 text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {cartQuantity > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                  {cartQuantity > 99 ? "99+" : cartQuantity}
                </span>
              )}
            </Link>

            <div className="mx-2 h-5 w-px bg-slate-200" />

            {userInfo?.isAdmin && (
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={adminMenuOpen}
                  aria-controls="desktop-admin-menu"
                  onClick={() => setAdminMenuOpen((prev) => !prev)}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Admin
                </button>
                {adminMenuOpen && (
                  <div
                    id="desktop-admin-menu"
                    className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-premium"
                  >
                    <Link to="/admin/users" className="block rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950">
                      Quản lý người dùng
                    </Link>
                    <Link to="/admin/products" className="block rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950">
                      Quản lý sản phẩm
                    </Link>
                    <Link to="/admin/orders" className="block rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950">
                      Quản lý đơn hàng
                    </Link>
                  </div>
                )}
              </div>
            )}

            {userInfo?.token ? (
              <>
                <span className="rounded-full bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700">
                  {userInfo.name}
                </span>
                <button type="button" onClick={logout} className="btn-ghost text-xs">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-xs">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-secondary px-4 py-2 text-xs">
                  Đăng ký
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/cart"
              aria-label={`Mở giỏ hàng, hiện có ${cartQuantity} sản phẩm`}
              className="relative rounded-full p-2.5 text-slate-700 transition hover:bg-slate-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {cartQuantity > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                  {cartQuantity > 99 ? "99+" : cartQuantity}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-primary-nav"
              aria-label={mobileMenuOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-400"
            >
              {mobileMenuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-primary-nav"
        className={`overflow-hidden border-b border-slate-200 bg-white transition-all duration-300 md:hidden ${
          mobileMenuOpen ? "max-h-[540px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Điều hướng di động" className="space-y-2 px-4 py-4 sm:px-6">
          <Link to="/" className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950">
            Trang chủ
          </Link>
          <Link to="/products" className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950">
            Sản phẩm
          </Link>
          <Link to="/cart" className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950">
            Giỏ hàng ({cartQuantity})
          </Link>
          <Link to="/products?sort=newest" className="block rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
            Mới về hôm nay
          </Link>

          {userInfo?.isAdmin && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="px-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Admin</p>
              <div className="mt-2 space-y-1">
                <Link to="/admin/users" className="block rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-950">
                  Quản lý người dùng
                </Link>
                <Link to="/admin/products" className="block rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-950">
                  Quản lý sản phẩm
                </Link>
                <Link to="/admin/orders" className="block rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-950">
                  Quản lý đơn hàng
                </Link>
              </div>
            </div>
          )}

          {userInfo?.token ? (
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-700">{userInfo.name}</p>
              <button type="button" onClick={logout} className="btn-secondary mt-3 w-full py-3 text-sm">
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="grid gap-2 pt-2 sm:grid-cols-2">
              <Link to="/login" className="btn-ghost justify-center py-3 text-sm">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn-secondary justify-center py-3 text-sm">
                Đăng ký
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
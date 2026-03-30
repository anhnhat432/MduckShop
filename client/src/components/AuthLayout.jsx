import TrustBar from "./TrustBar";

const defaultTrustItems = [
  {
    icon: "secure",
    label: "Phiên đăng nhập an toàn",
    description: "Thông tin tài khoản được dùng để lưu giỏ hàng, đơn hàng và trạng thái checkout.",
  },
  {
    icon: "payment",
    label: "Checkout nhanh hơn",
    description: "Khi đã đăng nhập, shopper có thể đi tiếp sang các bước giao hàng và thanh toán mượt hơn.",
  },
  {
    icon: "support",
    label: "Theo dõi đơn dễ hơn",
    description: "Tài khoản giúp xem lại đơn hàng và nhận hỗ trợ nhanh nếu cần đổi size.",
  },
  {
    icon: "returns",
    label: "Hỗ trợ sau mua rõ ràng",
    description: "Chúng tôi vẫn hỗ trợ đổi size và theo dõi đơn sau khi bạn hoàn tất thanh toán.",
  },
];

function AuthLayout({
  eyebrow,
  title,
  description,
  sidebarTitle = "Mua sắm liền mạch hơn",
  sidebarDescription =
    "Đăng nhập hoặc tạo tài khoản để giữ lại giỏ hàng, theo dõi đơn và đi nhanh hơn qua checkout.",
  redirectNotice,
  trustItems = defaultTrustItems,
  children,
}) {
  return (
    <section className="page-shell py-8 sm:py-10 lg:py-12">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="surface-card p-6 sm:p-8">
          <p className="section-eyebrow">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>

          {redirectNotice ? (
            <div className="surface-muted mt-6 p-4">
              <p className="text-sm leading-7 text-slate-600">{redirectNotice}</p>
            </div>
          ) : null}

          <div className="mt-8">{children}</div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="surface-card p-5">
            <p className="section-eyebrow">Shopper support</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
              {sidebarTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {sidebarDescription}
            </p>
          </div>
          <TrustBar items={trustItems} compact />
        </aside>
      </div>
    </section>
  );
}

export default AuthLayout;
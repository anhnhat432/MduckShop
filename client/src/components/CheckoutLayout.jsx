import CheckoutSteps from "./CheckoutSteps";
import TrustBar from "./TrustBar";

const defaultTrustItems = [
  {
    icon: "shipping",
    label: "Giao nhanh toàn quốc",
    description: "Đơn nội thành thường đến trong 2-4 ngày làm việc.",
  },
  {
    icon: "returns",
    label: "Đổi size 7 ngày",
    description: "Giữ nguyên hộp và phụ kiện để đổi size thuận tiện hơn.",
  },
  {
    icon: "secure",
    label: "Bảo mật thông tin",
    description: "Thông tin đơn hàng chỉ được dùng để xử lý giao nhận.",
  },
  {
    icon: "support",
    label: "Hỗ trợ chọn size",
    description: "Bạn luôn có thể quay lại PDP để kiểm tra size và tồn kho.",
  },
];

function CheckoutLayout({
  step1,
  step2,
  step3,
  title,
  description,
  eyebrow = "Checkout",
  asideTitle = "Mua sắm an tâm",
  asideDescription =
    "Flow checkout được giữ tối giản để shopper đi nhanh từ xác nhận thông tin đến đặt hàng.",
  trustItems = defaultTrustItems,
  children,
}) {
  return (
    <section className="page-shell py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <CheckoutSteps step1={step1} step2={step2} step3={step3} />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="surface-card p-6 sm:p-8">
            <p className="section-eyebrow">{eyebrow}</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              {description}
            </p>
            <div className="mt-8">{children}</div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="surface-card p-5">
              <p className="section-eyebrow">Hỗ trợ mua hàng</p>
              <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-950">
                {asideTitle}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {asideDescription}
              </p>
            </div>
            <TrustBar items={trustItems} compact />
          </aside>
        </div>
      </div>
    </section>
  );
}

export default CheckoutLayout;
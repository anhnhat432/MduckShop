import { Link, useLocation, useParams } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import TrustBar from "../components/TrustBar";
import usePageMeta from "../hooks/usePageMeta";
import { formatPrice } from "../utils/formatPrice";

const successTrustItems = [
  {
    icon: "shipping",
    label: "Đơn hàng đã được ghi nhận",
    description: "Chúng tôi sẽ xử lý giao hàng dựa trên thông tin bạn vừa xác nhận.",
  },
  {
    icon: "payment",
    label: "Thanh toán khi nhận hàng",
    description: "Với COD, bạn không cần thực hiện thêm bước thanh toán online ở thời điểm này.",
  },
  {
    icon: "returns",
    label: "Hỗ trợ đổi size sau mua",
    description: "Nếu cần đổi size, bạn có thể liên hệ ngay sau khi nhận sản phẩm.",
  },
  {
    icon: "support",
    label: "Theo dõi đơn dễ dàng",
    description: "Bạn có thể xem chi tiết đơn bất kỳ lúc nào trong tài khoản của mình.",
  },
];

function OrderSuccessScreen() {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;
  const orderId = order?._id || id;
  const totalPrice = order?.totalPrice ?? null;
  const itemCount = order?.orderItems?.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  usePageMeta({
    title: "Đặt hàng thành công",
    description:
      "Đơn hàng của bạn đã được ghi nhận trên ShoeStore. Xem lại thông tin đơn hoặc tiếp tục mua sắm.",
  });

  return (
    <section className="page-shell py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="surface-card overflow-hidden p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-100 text-3xl text-emerald-700 shadow-soft">
                <span aria-hidden="true">✓</span>
              </div>
              <p className="section-eyebrow mt-5">Order success</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Đơn hàng của bạn đã được ghi nhận thành công
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Đây là màn hình chốt cảm xúc sau mua, vì vậy ưu tiên lớn nhất là tạo cảm giác yên tâm: đơn đã được tạo, thông tin đang được xử lý đúng và shopper biết ngay nên làm gì tiếp theo.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Mã đơn hàng
                </p>
                <p className="mt-2 text-sm font-bold text-slate-950 break-all">
                  {orderId}
                </p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Trạng thái thanh toán
                </p>
                <p className="mt-2 text-sm font-bold text-slate-950">
                  Chưa thanh toán
                </p>
                <p className="mt-1 text-xs text-slate-500">Bạn sẽ thanh toán khi nhận hàng.</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Trạng thái giao hàng
                </p>
                <p className="mt-2 text-sm font-bold text-slate-950">
                  Đang chờ xử lý
                </p>
                <p className="mt-1 text-xs text-slate-500">Đội ngũ sẽ xác nhận và đóng gói sớm.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-6">
            <div className="surface-card p-6 sm:p-7">
              <SectionHeading
                eyebrow="Order details"
                title="Thông tin đơn hàng của bạn"
                description="Tất cả dữ liệu quan trọng được gom lại ở một chỗ để shopper xác nhận nhanh rằng hệ thống đã ghi nhận đúng những gì vừa đặt."
                align="start"
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Mã đơn
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-950 break-all">
                    {orderId}
                  </p>
                </div>
                <div className="surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Sản phẩm
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-950">
                    {itemCount ? `${itemCount} sản phẩm` : "Sẽ hiển thị khi mở chi tiết đơn"}
                  </p>
                </div>
                <div className="surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Tổng giá trị
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-950">
                    {totalPrice ? formatPrice(totalPrice) : "Sẽ cập nhật trong chi tiết đơn"}
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-card p-6 sm:p-7">
              <SectionHeading
                eyebrow="What happens next"
                title="Bước tiếp theo sau khi đặt hàng"
                description="Trang success tốt không kết thúc flow một cách cụt lủn. Nó phải dẫn shopper sang hành động tiếp theo một cách tự nhiên."
                align="start"
              />

              <div className="mt-6 space-y-3">
                <div className="surface-muted flex gap-3 p-4">
                  <span className="mt-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Chúng tôi xác nhận đơn hàng</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Hệ thống đã nhận đơn. Bước tiếp theo là xác nhận thông tin và chuẩn bị đóng gói.
                    </p>
                  </div>
                </div>
                <div className="surface-muted flex gap-3 p-4">
                  <span className="mt-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Bạn theo dõi trạng thái đơn</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Mở trang chi tiết đơn để xem trạng thái xử lý, thanh toán và giao hàng bất kỳ lúc nào.
                    </p>
                  </div>
                </div>
                <div className="surface-muted flex gap-3 p-4">
                  <span className="mt-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                    3
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Tiếp tục mua sắm nếu muốn</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Bạn có thể quay lại danh mục để khám phá thêm hoặc lưu lại mã đơn này cho lần tra cứu sau.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="surface-card p-6">
              <p className="section-eyebrow">Next actions</p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                Bạn muốn làm gì tiếp theo?
              </h2>
              <div className="mt-6 space-y-3">
                <Link
                  to={`/order/${orderId}`}
                  className="btn-primary w-full justify-center py-4 text-base"
                >
                  Xem chi tiết đơn hàng
                </Link>
                <Link
                  to="/products"
                  className="btn-ghost w-full justify-center py-4 text-base"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
            <TrustBar items={successTrustItems} compact />
          </aside>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccessScreen;
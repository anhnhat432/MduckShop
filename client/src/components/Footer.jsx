import { Link } from "react-router-dom";
import TrustBar from "./TrustBar";

const trustItems = [
  {
    icon: "shipping",
    label: "Giao nhanh toàn quốc",
    description: "Miễn phí vận chuyển cho đơn từ 2.000.000đ.",
  },
  {
    icon: "returns",
    label: "Đổi size 7 ngày",
    description: "Hỗ trợ đổi size nhanh nếu sản phẩm chưa qua sử dụng.",
  },
  {
    icon: "payment",
    label: "Thanh toán linh hoạt",
    description: "Hỗ trợ COD để shopper yên tâm hơn khi mua lần đầu.",
  },
  {
    icon: "authentic",
    label: "Chính hãng 100%",
    description: "Thông tin sản phẩm rõ ràng, tồn kho minh bạch theo từng size.",
  },
];

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/92 backdrop-blur">
      <div className="page-shell py-10 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8">
          <TrustBar items={trustItems} />

          <div className="grid gap-8 rounded-[2rem] border border-slate-200/80 bg-slate-950 px-6 py-8 text-white sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                ShoeStore
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
                Premium sneaker storefront cho trải nghiệm mua hàng nhanh và rõ ràng.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                Tập trung vào điều shopper cần nhất: ảnh sản phẩm lớn, chọn size dễ, CTA rõ và flow checkout gọn.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                Điều hướng
              </p>
              <div className="mt-4 space-y-3 text-sm text-white/72">
                <Link to="/" className="block transition hover:text-white">
                  Trang chủ
                </Link>
                <Link to="/products" className="block transition hover:text-white">
                  Tất cả sản phẩm
                </Link>
                <Link to="/cart" className="block transition hover:text-white">
                  Giỏ hàng
                </Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                Cam kết
              </p>
              <div className="mt-4 space-y-3 text-sm text-white/72">
                <p>Giao hàng tiêu chuẩn 2-4 ngày làm việc.</p>
                <p>Đổi size trong 7 ngày theo điều kiện cửa hàng.</p>
                <p>Thông tin đơn hàng và thanh toán được xử lý an toàn.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} ShoeStore. All rights reserved.</p>
            <p>Thiết kế theo hướng tối giản, premium và mobile-first cho storefront bán giày.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
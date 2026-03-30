import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutLayout from "../components/CheckoutLayout";
import { useStore } from "../context/StoreContext";
import usePageMeta from "../hooks/usePageMeta";
import { getPaymentGuardRedirect } from "../utils/checkoutGuards";

function PaymentScreen() {
  const navigate = useNavigate();
  const { cart, savePaymentMethod } = useStore();
  const [paymentMethod, setPaymentMethod] = useState(
    cart.paymentMethod || "COD"
  );

  usePageMeta({
    title: "Phương thức thanh toán",
    description: "Chọn phương thức thanh toán trước khi xác nhận đơn hàng trên ShoeStore.",
  });

  useEffect(() => {
    const redirectPath = getPaymentGuardRedirect(cart);
    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [cart, navigate]);

  const submitHandler = (event) => {
    event.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate("/placeorder");
  };

  return (
    <CheckoutLayout
      step1
      step2
      eyebrow="Payment"
      title="Chọn phương thức thanh toán"
      description="Giữ ít lựa chọn nhưng rõ ràng để shopper đi qua bước thanh toán nhanh hơn, không bị cảm giác như một form kỹ thuật."
      asideDescription="Với đơn mua đầu tiên, COD là lựa chọn an toàn và quen thuộc hơn cho shopper."
    >
      <form className="space-y-5" onSubmit={submitHandler}>
        <fieldset className="space-y-4">
          <legend className="label-field mb-0">Phương thức đang hỗ trợ</legend>

          <label
            className={`block cursor-pointer rounded-[1.75rem] border-2 p-5 transition ${
              paymentMethod === "COD"
                ? "border-orange-500 bg-orange-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="mt-1 h-4 w-4 accent-orange-500"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-950">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <span className="info-chip border-emerald-200 bg-emerald-50 text-emerald-700">
                    Khuyên dùng
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Shopper có thể nhận hàng, kiểm tra sản phẩm rồi mới thanh toán. Đây là lựa chọn đơn giản nhất để giữ conversion tốt cho flow hiện tại.
                </p>
              </div>
            </div>
          </label>
        </fieldset>

        <div className="surface-muted p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Bảo mật thông tin
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Thông tin của bạn chỉ được dùng để xử lý đơn hàng và chăm sóc sau bán. Chúng tôi không yêu cầu nhập thông tin thẻ ở flow hiện tại.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/shipping" className="btn-ghost justify-center">
            Quay lại địa chỉ giao hàng
          </Link>
          <button type="submit" className="btn-primary min-w-[220px] justify-center py-4 text-base">
            Xem lại đơn hàng
          </button>
        </div>
      </form>
    </CheckoutLayout>
  );
}

export default PaymentScreen;
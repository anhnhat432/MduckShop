import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutLayout from "../components/CheckoutLayout";
import { useStore } from "../context/StoreContext";
import usePageMeta from "../hooks/usePageMeta";
import { getShippingGuardRedirect } from "../utils/checkoutGuards";

function ShippingScreen() {
  const navigate = useNavigate();
  const { cart, saveShippingAddress } = useStore();
  const [address, setAddress] = useState(cart.shippingAddress?.address || "");
  const [city, setCity] = useState(cart.shippingAddress?.city || "");
  const [phoneNumber, setPhoneNumber] = useState(
    cart.shippingAddress?.phoneNumber || ""
  );

  usePageMeta({
    title: "Địa chỉ giao hàng",
    description:
      "Nhập địa chỉ nhận hàng để tiếp tục thanh toán trên ShoeStore.",
  });

  useEffect(() => {
    const redirectPath = getShippingGuardRedirect(cart);
    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [cart, navigate]);

  const submitHandler = (event) => {
    event.preventDefault();
    saveShippingAddress({
      address: address.trim(),
      city: city.trim(),
      phoneNumber: phoneNumber.trim(),
    });
    navigate("/payment");
  };

  return (
    <CheckoutLayout
      step1
      eyebrow="Shipping"
      title="Thông tin giao hàng"
      description="Điền địa chỉ nhận hàng để chúng tôi giữ flow checkout ngắn gọn và chuyển bạn nhanh sang bước chọn thanh toán."
      asideDescription="Thông tin giao hàng được dùng để xác nhận đơn, liên hệ khi cần đổi size và ước tính thời gian nhận hàng."
    >
      <form className="space-y-5" onSubmit={submitHandler}>
        <div className="surface-muted p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Đơn hàng hiện tại
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Bạn đang checkout với {cart.cartItems?.length || 0} sản phẩm. Chỉ cần địa chỉ chính xác và số điện thoại liên hệ là đủ để tiếp tục.
          </p>
        </div>

        <div>
          <label htmlFor="shipping-address" className="label-field">
            Địa chỉ cụ thể
          </label>
          <input
            id="shipping-address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Số nhà, tên đường, phường/xã"
            className="input-field"
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="shipping-city" className="label-field">
              Thành phố
            </label>
            <input
              id="shipping-city"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Hồ Chí Minh"
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="shipping-phone" className="label-field">
              Số điện thoại
            </label>
            <input
              id="shipping-phone"
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="0901234567"
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="surface-muted p-4">
          <p className="text-sm leading-7 text-slate-600">
            Chúng tôi sẽ dùng số điện thoại này để xác nhận đơn, cập nhật trạng thái giao hàng và hỗ trợ đổi size nếu bạn cần sau khi nhận hàng.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/cart" className="btn-ghost justify-center">
            Quay lại giỏ hàng
          </Link>
          <button type="submit" className="btn-primary min-w-[220px] justify-center py-4 text-base">
            Tiếp tục đến thanh toán
          </button>
        </div>
      </form>
    </CheckoutLayout>
  );
}

export default ShippingScreen;
import { Link } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";

function NotFoundScreen() {
  usePageMeta({
    title: "Không tìm thấy trang",
    description: "Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.",
  });

  return (
    <section className="min-h-[70vh] bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Không tìm thấy trang bạn cần
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
          Liên kết có thể đã thay đổi, hoặc trang này không còn tồn tại. Bạn có thể quay về trang chủ hoặc tiếp tục mua sắm trong danh mục sản phẩm.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Về trang chủ
          </Link>
          <Link
            to="/products"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundScreen;

import { Link } from "react-router-dom";

function AdminPlaceholderScreen({ title, description }) {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
          Admin Module
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
        <Link
          to="/admin/orders"
          className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Mở module đơn hàng
        </Link>
      </div>
    </section>
  );
}

export default AdminPlaceholderScreen;


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const formatPrice = (price = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

function ProductListScreen() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get("/products?limit=1000");

        if (isMounted) {
          setProducts(response.data.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Không thể tải danh sách sản phẩm."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const createProductHandler = async () => {
    try {
      setCreateLoading(true);
      setActionError("");

      const response = await axiosClient.post("/products");
      navigate(`/admin/product/${response.data.data._id}/edit`);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Không thể tạo sản phẩm mới."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteProductHandler = async (productId) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");

    if (!confirmed) {
      return;
    }

    try {
      setActionError("");
      await axiosClient.delete(`/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Không thể xóa sản phẩm."
      );
    }
  };

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Admin Products
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Quản lý sản phẩm
            </h1>
          </div>

          <button
            type="button"
            onClick={createProductHandler}
            disabled={createLoading}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              createLoading
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
          >
            {createLoading ? "Đang tạo..." : "Tạo sản phẩm mới"}
          </button>
        </div>

        {actionError && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {actionError}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-600">
            Đang tải danh sách sản phẩm...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Tên</th>
                  <th className="px-4 py-3 font-semibold">Hãng</th>
                  <th className="px-4 py-3 font-semibold">Giá</th>
                  <th className="px-4 py-3 font-semibold">Tồn kho</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product._id} className="align-top">
                    <td className="px-4 py-4 font-mono text-xs text-slate-700">
                      {product._id}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {product.description || "Không có mô tả"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{product.brand}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      {product.stockQuantity}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {product.isActive ? "Đang bán" : "Ẩn sản phẩm"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                        >
                          Sửa
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteProductHandler(product._id)}
                          className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-600"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductListScreen;


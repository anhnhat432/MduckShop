import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const createEmptySizeRow = () => ({
  size: "",
  stock: "",
});

function ProductEditScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [sizes, setSizes] = useState([createEmptySizeRow()]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get(`/products/${id}`);
        const product = response.data.data;

        if (isMounted) {
          setName(product.name || "");
          setBrand(product.brand || "");
          setDescription(product.description || "");
          setPrice(product.price || 0);
          setImageUrl(product.imageUrls?.[0] || "");
          setSizes(
            product.sizes?.length
              ? product.sizes.map((item) => ({
                  size: String(item.size),
                  stock: String(item.stock),
                }))
              : [createEmptySizeRow()]
          );
          setIsFeatured(Boolean(product.isFeatured));
          setIsActive(Boolean(product.isActive));
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Không thể tải thông tin sản phẩm."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSizeChange = (index, field, value) => {
    setSizes((prevSizes) =>
      prevSizes.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addSizeRow = () => {
    setSizes((prevSizes) => [...prevSizes, createEmptySizeRow()]);
  };

  const removeSizeRow = (index) => {
    setSizes((prevSizes) => {
      if (prevSizes.length === 1) {
        return prevSizes;
      }

      return prevSizes.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const uploadFileHandler = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImageUrl(response.data.data.imageUrl);
    } catch (err) {
      setUploadError(
        err.response?.data?.message ||
          "Upload ảnh thất bại. Vui lòng thử lại."
      );
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const normalizedSizes = sizes
        .map((item) => ({
          size: Number(item.size),
          stock: Number(item.stock),
        }))
        .filter(
          (item) =>
            Number.isFinite(item.size) &&
            Number.isFinite(item.stock) &&
            item.size > 0 &&
            item.stock >= 0
        );

      await axiosClient.put(`/products/${id}`, {
        name,
        brand,
        description,
        price: Number(price),
        sizes: normalizedSizes,
        imageUrls: imageUrl ? [imageUrl] : [],
        isFeatured,
        isActive,
      });

      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể cập nhật sản phẩm."
      );
    } finally {
      setSaving(false);
    }
  };

  const stockQuantity = sizes.reduce((total, item) => {
    const stock = Number(item.stock);
    return total + (Number.isFinite(stock) ? stock : 0);
  }, 0);

  if (loading) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
          Đang tải thông tin sản phẩm...
        </div>
      </section>
    );
  }

  if (error && !name && !brand && !imageUrl) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
            Error
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            Không thể tải sản phẩm
          </h1>
          <p className="mt-4 text-sm text-slate-600">{error}</p>
          <Link
            to="/admin/products"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Về danh sách sản phẩm
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Product Editor
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Chỉnh sửa sản phẩm
            </h1>
          </div>
          <Link
            to="/admin/products"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Về danh sách sản phẩm
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-8" onSubmit={submitHandler}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tên sản phẩm
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Hãng
              </label>
              <input
                type="text"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Giá
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tổng số lượng tồn kho
              </label>
              <input
                type="number"
                value={stockQuantity}
                readOnly
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Mô tả
            </label>
            <textarea
              rows="5"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div className="rounded-3xl border border-slate-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Danh sách size</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Nhập từng size và số lượng tồn kho tương ứng.
                </p>
              </div>
              <button
                type="button"
                onClick={addSizeRow}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Thêm size
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {sizes.map((sizeRow, index) => (
                <div key={`size-row-${index}`} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    type="number"
                    min="35"
                    max="50"
                    value={sizeRow.size}
                    onChange={(event) =>
                      handleSizeChange(index, "size", event.target.value)
                    }
                    placeholder="Size (vd: 40)"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    value={sizeRow.stock}
                    onChange={(event) =>
                      handleSizeChange(index, "stock", event.target.value)
                    }
                    placeholder="Số lượng"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeSizeRow(index)}
                    className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">Hình ảnh sản phẩm</h2>
            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_280px]">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    URL hình ảnh
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Upload từ máy tính
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={uploadFileHandler}
                    className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Ảnh sẽ được upload lên server, sau đó URL sẽ tự động điền vào form.
                  </p>
                  {uploading && (
                    <p className="mt-2 text-sm text-slate-600">Đang upload ảnh...</p>
                  )}
                  {uploadError && (
                    <p className="mt-2 text-sm text-rose-600">{uploadError}</p>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name || "Product preview"}
                    className="h-full min-h-[260px] w-full object-cover"
                  />
                ) : (
                  <div className="flex min-h-[260px] items-center justify-center px-6 text-center text-sm text-slate-400">
                    Chưa có ảnh preview
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 rounded-3xl border border-slate-200 p-6">
            <label className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) => setIsFeatured(event.target.checked)}
                className="h-4 w-4 accent-slate-900"
              />
              Đánh dấu là sản phẩm nổi bật
            </label>
            <label className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="h-4 w-4 accent-slate-900"
              />
              Hiện sản phẩm trên website
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-semibold transition ${
              saving
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
          >
            {saving ? "Đang lưu thay đổi..." : "Lưu sản phẩm"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ProductEditScreen;


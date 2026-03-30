import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../api/productService";
import { getApiErrorMessage } from "../utils/apiError";
import { buildProductCatalogApiParams, PRODUCT_PAGE_SIZE } from "../utils/productCatalog";

const defaultPagination = {
  currentPage: 1,
  pageSize: PRODUCT_PAGE_SIZE,
  totalProducts: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

function useProductCatalog(filters) {
  const params = useMemo(
    () => buildProductCatalogApiParams(filters),
    [filters.brand, filters.keyword, filters.page, filters.price, filters.size, filters.sort]
  );
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts(params);

        if (!isMounted) {
          return;
        }

        setProducts(data.data || []);
        setPagination(data.pagination || defaultPagination);
        setAvailableBrands(data.availableBrands || []);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setProducts([]);
        setPagination(defaultPagination);
        setAvailableBrands([]);
        setError(
          getApiErrorMessage(err, "Không thể tải danh sách sản phẩm lúc này.")
        );
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
  }, [params]);

  return {
    products,
    pagination,
    availableBrands,
    loading,
    error,
  };
}

export default useProductCatalog;

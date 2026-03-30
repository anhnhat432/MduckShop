import axiosClient from "./axiosClient";

const sanitizeParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

export const getProducts = async (params = {}) => {
  const response = await axiosClient.get("/products", {
    params: sanitizeParams(params),
  });

  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosClient.get(`/products/${id}`);
  return response.data.data;
};

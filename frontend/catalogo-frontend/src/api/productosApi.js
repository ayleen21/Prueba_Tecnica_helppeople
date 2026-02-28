export const uploadProductosCsv = (file) => {
  const formData = new FormData();
  formData.append("archivo", file);
  return axiosClient.post("/productos/carga-masiva-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
import axiosClient from "./axiosClient";

export const getProductos = (params) => {
  return axiosClient.get("/productos", { params });
};

export const getProductoById = (id) => {
  return axiosClient.get(`/productos/${id}`);
};

export const createProducto = (data) => {
  return axiosClient.post("/productos", data);
};

export const updateProducto = (id, data) => {
  return axiosClient.put(`/productos/${id}`, data);
};

export const deleteProducto = (id) => {
  return axiosClient.delete(`/productos/${id}`);
};

export const createProductosMasivo = (data) => {
  return axiosClient.post("/productosMasivo", data);
};

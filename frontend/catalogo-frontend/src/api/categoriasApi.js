import axiosClient from "./axiosClient";

export const getCategorias = () => {
  return axiosClient.get("/categorias");
};

export const createCategoria = (data) => {
  return axiosClient.post("/categorias", data);
};

export const updateCategoria = (id, data) => {
  return axiosClient.put(`/categorias/${id}`, data);
};

export const deleteCategoria = (id) => {
  return axiosClient.delete(`/categorias/${id}`);
};

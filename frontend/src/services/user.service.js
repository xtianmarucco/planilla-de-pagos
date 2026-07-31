import { get, post, put, del } from "./api.js";

export const fetchUsers = () => get("/users");
export const createUser = (data) => post("/users", data);
export const updateUser = (id, data) => put(`/users/${id}`, data);
export const updateUserPassword = (id, password) =>
  put(`/users/${id}/password`, { password });
export const deleteUser = (id) => del(`/users/${id}`);

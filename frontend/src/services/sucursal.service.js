import { get, post, patch, del } from "./api.js";

export const fetchSucursales = (client_id) => get("/sucursales", { client_id });
export const createSucursal = (data) => post("/sucursales", data);
export const updateSucursal = (id, data) => patch(`/sucursales/${id}`, data);
export const deleteSucursal = (id) => del(`/sucursales/${id}`);

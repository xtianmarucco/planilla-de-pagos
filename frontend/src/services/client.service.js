import { get, post, put, del } from "./api.js";

export const fetchClients = () => get("/clients");
export const createClient = (data) => post("/clients", data);
export const updateClient = (id, data) => put(`/clients/${id}`, data);
export const deleteClient = (id) => del(`/clients/${id}`);

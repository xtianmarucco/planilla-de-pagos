import { get } from "./api.js";

export const fetchSummary = (from, to, { client_id, client_type } = {}) => {
  const params = { from, to };
  if (client_type) params.client_type = client_type;
  if (client_id)   params.client_id   = client_id;
  return get("/reports/summary", params);
};

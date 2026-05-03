import { get } from "./api.js";

export const fetchSummary = (from, to) => get("/reports/summary", { from, to });

import * as ReportService from '../services/report.service.js';
import { success } from '../utils/response.js';

export const getSummary = async (req, res, next) => {
  try {
    const { from, to, client_id, client_type } = req.query;
    success(res, await ReportService.getSummary(from, to, { client_id: client_id ? parseInt(client_id) : undefined, client_type }));
  } catch (err) {
    next(err);
  }
};

import * as ReportService from '../services/report.service.js';
import { success } from '../utils/response.js';

export const getSummary = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    success(res, await ReportService.getSummary(from, to));
  } catch (err) {
    next(err);
  }
};

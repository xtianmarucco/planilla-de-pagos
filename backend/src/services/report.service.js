import * as ReportRepository from '../repositories/report.repository.js';
import { AppError } from '../utils/AppError.js';

export const getSummary = async (from, to) => {
  if (!from || !to) throw new AppError('Los parámetros from y to son requeridos', 400, 'VALIDATION_ERROR');

  const [totals, byStatus, byMethod, payments] = await Promise.all([
    ReportRepository.getTotals(from, to),
    ReportRepository.getByStatus(from, to),
    ReportRepository.getByMethod(from, to),
    ReportRepository.getPayments(from, to),
  ]);

  const byClientType = Object.values(
    payments.reduce((acc, p) => {
      const type = p.client?.type ?? 'OTRO';
      if (!acc[type]) acc[type] = { type, count: 0, amount: 0 };
      acc[type].count++;
      acc[type].amount += Number(p.amount);
      return acc;
    }, {}),
  );

  return {
    period: { from, to },
    totals: {
      count:  totals._count.id,
      amount: Number(totals._sum.amount ?? 0),
    },
    by_status: byStatus.map((r) => ({
      status: r.status,
      count:  r._count.id,
      amount: Number(r._sum.amount ?? 0),
    })),
    by_method: byMethod.map((r) => ({
      method: r.payment_method,
      count:  r._count.id,
      amount: Number(r._sum.amount ?? 0),
    })),
    by_client_type: byClientType,
    payments,
  };
};

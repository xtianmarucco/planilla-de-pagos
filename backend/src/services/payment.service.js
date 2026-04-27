import * as PaymentRepository from '../repositories/payment.repository.js';
import * as ClientRepository  from '../repositories/client.repository.js';
import { AppError } from '../utils/AppError.js';
import { toPaymentDate } from '../utils/paymentDate.js';

export const getPayments = ({ client_id, sucursal_id, status, client_type, client_name, amount, from, to } = {}) =>
  PaymentRepository.findAll({
    client_id:   client_id   ? parseInt(client_id)   : undefined,
    sucursal_id: sucursal_id ? parseInt(sucursal_id) : undefined,
    status:      status      || undefined,
    client_type: client_type || undefined,
    client_name: client_name?.trim() || undefined,
    amount:      amount      ? parseFloat(amount)    : undefined,
    from:        from        || undefined,
    to:          to          || undefined,
  });

export const getPaymentById = async (id) => {
  const payment = await PaymentRepository.findById(id);
  if (!payment) throw new AppError('Pago no encontrado', 404, 'NOT_FOUND');
  return payment;
};

export const createPayment = async (data, userId) => {
  const client = await ClientRepository.findById(data.client_id);
  if (!client || !client.is_active)
    throw new AppError('Cliente no encontrado', 404, 'NOT_FOUND');

  // CUENTA_CORRIENTE always starts as PENDIENTE regardless of what was sent
  const status = data.payment_method === 'CUENTA_CORRIENTE' ? 'PENDIENTE' : 'PAGADO';

  return PaymentRepository.create({
    client_id:      data.client_id,
    user_id:        userId ?? null,
    sucursal_id:    data.sucursal_id ?? null,
    amount:         parseFloat(data.amount),
    payment_date:   toPaymentDate(data.payment_date),
    payment_method: data.payment_method,
    status,
    notes:          data.notes?.trim() || null,
  });
};

export const updatePayment = async (id, data) => {
  await getPaymentById(id);

  const status = data.payment_method === 'CUENTA_CORRIENTE' ? 'PENDIENTE' : 'PAGADO';

  return PaymentRepository.update(id, {
    sucursal_id:    data.sucursal_id ?? null,
    amount:         parseFloat(data.amount),
    payment_date:   toPaymentDate(data.payment_date),
    payment_method: data.payment_method,
    status,
    notes:          data.notes?.trim() || null,
  });
};

export const updatePaymentStatus = async (id, status) => {
  await getPaymentById(id);
  return PaymentRepository.updateStatus(id, status);
};

export const deletePayment = async (id) => {
  await getPaymentById(id);
  return PaymentRepository.remove(id);
};

import * as SucursalRepository from '../repositories/sucursal.repository.js';
import * as ClientRepository from '../repositories/client.repository.js';
import { AppError } from '../utils/AppError.js';

export const getSucursalesByClient = (client_id) =>
  SucursalRepository.findByClient(client_id);

export const getSucursalById = async (id) => {
  const sucursal = await SucursalRepository.findById(id);
  if (!sucursal || !sucursal.is_active)
    throw new AppError('Sucursal no encontrada', 404, 'NOT_FOUND');
  return sucursal;
};

export const createSucursal = async (data) => {
  const client = await ClientRepository.findById(data.client_id);
  if (!client || !client.is_active)
    throw new AppError('Cliente no encontrado', 404, 'NOT_FOUND');
  if (client.type !== 'MAYORISTA')
    throw new AppError('Solo los clientes MAYORISTA pueden tener sucursales', 400, 'INVALID_OPERATION');

  return SucursalRepository.create({
    client_id: data.client_id,
    name:      data.name.trim(),
    address:   data.address?.trim() || null,
    phone:     data.phone?.trim()   || null,
  });
};

export const updateSucursal = async (id, data) => {
  await getSucursalById(id);
  return SucursalRepository.update(id, {
    name:    data.name.trim(),
    address: data.address?.trim() || null,
    phone:   data.phone?.trim()   || null,
  });
};

export const deleteSucursal = async (id) => {
  await getSucursalById(id);
  return SucursalRepository.softDelete(id);
};

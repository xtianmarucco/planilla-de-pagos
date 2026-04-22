import * as ClientRepository from '../repositories/client.repository.js';
import { AppError } from '../utils/AppError.js';

export const getActiveClients = () => ClientRepository.findAllActive();

export const getClientById = async (id) => {
  const client = await ClientRepository.findById(id);
  if (!client || !client.is_active) throw new AppError('Cliente no encontrado', 404);
  return client;
};

export const createClient = (data) =>
  ClientRepository.create({
    name:    data.name.trim(),
    type:    data.type,
    phone:   data.phone?.trim()   || null,
    address: data.address?.trim() || null,
  });

export const updateClient = async (id, data) => {
  await getClientById(id);
  return ClientRepository.update(id, {
    name:    data.name.trim(),
    type:    data.type,
    phone:   data.phone?.trim()   || null,
    address: data.address?.trim() || null,
  });
};

export const deleteClient = async (id) => {
  await getClientById(id);
  return ClientRepository.softDelete(id);
};

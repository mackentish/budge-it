import { Pocket } from '../types';
import baseInstance from './base';

const fetchPockets = async () => {
  const response = await baseInstance.request({
    url: '/pockets',
    method: 'GET',
    headers: {
      'X-API-KEY': process.env.EXPO_PUBLIC_API_KEY,
      Accept: 'application/json',
    },
  });
  const data = response.data;
  return data as Pocket[];
};

const updatePocket = async (pocket: Pocket) => {
  const response = await baseInstance.request({
    url: `/pockets/${pocket.id}`,
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      name: pocket.name,
      groupId: pocket.groupId,
    },
  });
  const data = await response.data;
  return data as Pocket;
};

const createPocket = async (pocket: Omit<Pocket, 'id'>) => {
  const response = await baseInstance.request({
    url: '/pockets',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: pocket,
  });
  const data = await response.data;
  return data as Pocket;
};

const deletePocket = async (id: string) => {
  const response = await baseInstance.request({
    url: `/pockets/${id}`,
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const data = await response.data;
  return data as Pocket;
};

export { fetchPockets, updatePocket, createPocket, deletePocket };

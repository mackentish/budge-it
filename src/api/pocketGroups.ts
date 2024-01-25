import { PocketGroup } from '../types';
import baseInstance from './base';

const getGroups = async () => {
  const response = await baseInstance.request({
    url: '/pocketGroups',
    method: 'GET',
    headers: {
      'X-API-KEY': process.env.API_KEY,
      Accept: 'application/json',
    },
  });
  const data = response.data;
  return data as PocketGroup[];
};

const postGroup = async (group: Omit<PocketGroup, 'id'>) => {
  const response = await baseInstance.request({
    url: '/pocketGroups',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: { ...group, pockets: group.pockets.map((pocket) => pocket.id) },
  });
  const data = await response.data;
  return data as PocketGroup;
};

const deleteGroup = async (id: string) => {
  const response = await baseInstance.request({
    url: `/pocketGroups/${id}`,
    method: 'DELETE',
    headers: {
      'X-API-KEY': process.env.API_KEY,
      Accept: 'application/json',
    },
  });
  const data = response.data;
  return data as PocketGroup;
};

export { getGroups, postGroup, deleteGroup };

import { Transaction } from '../types';
import baseInstance from './base';

const getTransactions = async () => {
  const response = await baseInstance.request({
    url: '/transactions',
    method: 'GET',
    headers: {
      'X-API-KEY': process.env.EXPO_PUBLIC_API_KEY,
      Accept: 'application/json',
    },
  });
  const data = response.data;
  return data as Transaction[];
};

const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  const response = await baseInstance.request({
    url: '/transactions',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: transaction,
  });
  const data = await response.data;
  return data as Transaction;
};

export { getTransactions, addTransaction };

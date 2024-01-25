import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { addTransaction, getTransactions } from '../../api/transactions';
import { Transaction } from '../../types';

export function useTransactions() {
  // GET /transactions
  const fetchTransactions = useQuery<Transaction[]>({
    queryKey: ['userTransactions'],
    queryFn: getTransactions,
  });

  // POST /transactions
  const createTransaction = useMutation({
    mutationFn: (transaction: Omit<Transaction, 'id'>) => {
      return addTransaction(transaction);
    },
    onSuccess: () => {
      fetchTransactions.refetch();
    },
    onError: () => {
      Alert.alert(
        'Error',
        'Sorry, we are unable to create this transaction for you.'
      );
    },
  });

  return { fetchTransactions, createTransaction };
}

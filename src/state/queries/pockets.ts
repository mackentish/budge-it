import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';

import {
  createPocket as createFn,
  deletePocket as deleteFn,
  fetchPockets as fetchPocketsFn,
  updatePocket as updateFn,
} from '../../api/pockets';
import { Pocket } from '../../types';

export function usePockets() {
  // GET /pockets
  const fetchPockets = useQuery<Pocket[]>({
    queryKey: ['userPockets'],
    queryFn: fetchPocketsFn,
  });

  // PUT /pockets/:id
  const updatePocket = useMutation({
    mutationFn: updateFn,
    onSuccess: () => {
      fetchPockets.refetch();
    },
  });

  // POST /pockets
  const createPocket = useMutation({
    mutationFn: (pocket: Omit<Pocket, 'id'>) => {
      return createFn(pocket);
    },
    onSuccess: () => {
      fetchPockets.refetch();
    },
    onError: () => {
      Alert.alert(
        'Error',
        'Sorry, we are unable to create another pocket for you.'
      );
    },
  });

  // DELETE /pockets/:id
  const deletePocket = useMutation({
    mutationFn: (id: string) => {
      return deleteFn(id);
    },
    onSuccess: () => {
      fetchPockets.refetch();
    },
    onError: () => {
      Alert.alert('Error', 'Sorry, we are unable to delete this pocket.');
    },
  });

  return { fetchPockets, updatePocket, createPocket, deletePocket };
}

import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';

import {
  deleteGroup as deleteFn,
  getGroups,
  postGroup,
} from '../../api/pocketGroups';
import { PocketGroup } from '../../types';

export function useGroups() {
  // GET /pocketGroups
  const fetchGroups = useQuery<PocketGroup[]>({
    queryKey: ['userPocketGroups'],
    queryFn: getGroups,
  });

  // POST /pocketGroups
  const createGroup = useMutation({
    mutationFn: (group: Omit<PocketGroup, 'id'>) => {
      return postGroup(group);
    },
    onSuccess: () => {
      fetchGroups.refetch();
    },
    onError: () => {
      Alert.alert(
        'Error',
        'Sorry, we are unable to create another group for you.'
      );
    },
  });

  // DELETE /pocketGroups/:id
  const deleteGroup = useMutation({
    mutationFn: (id: string) => {
      return deleteFn(id);
    },
    onSuccess: () => {
      fetchGroups.refetch();
    },
    onError: () => {
      Alert.alert('Error', 'Sorry, we are unable to delete this pocket.');
    },
  });

  return { fetchGroups, createGroup, deleteGroup };
}

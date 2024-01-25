import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { Alert } from 'react-native';

import {
  addUser,
  addUserTag,
  changeUserTag,
  loginUser as loginFn,
} from '../../api/users';
import { UserContext } from '../context';

export function useUser() {
  const { setUser } = useContext(UserContext);

  const loginUser = useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      Alert.alert('Error', 'Invalid email or password');
    },
  });

  const createUser = useMutation({
    mutationFn: addUser,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      Alert.alert('Error', 'Unable to create account');
    },
  });

  const createUserTag = useMutation({
    mutationFn: addUserTag,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      Alert.alert('Error', 'Unable to create user tag');
    },
  });

  const updateUserTag = useMutation({
    mutationFn: changeUserTag,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      Alert.alert('Error', 'Unable to update user tag');
    },
  });

  return { loginUser, createUser, createUserTag, updateUserTag };
}

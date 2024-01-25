import { User, UserLogin, UserRegister } from '../types';
import baseInstance from './base';

const loginUser = async (loginData: UserLogin) => {
  try {
    const response = await baseInstance.request({
      url: '/users/login',
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.API_KEY,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: loginData,
    });
    const data = await response.data;
    return data.user as User;
  } catch (error) {
    throw new Error('Error logging in');
  }
};

const addUser = async (userData: UserRegister) => {
  try {
    const response = await baseInstance.request({
      url: '/users',
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.API_KEY,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: userData,
    });
    const data = await response.data;
    return data.user as User;
  } catch (error) {
    throw new Error('Error creating user');
  }
};

const addUserTag = async (tag: string) => {
  try {
    const response = await baseInstance.request({
      url: '/users/tags',
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.API_KEY,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: { tag },
    });
    const data = await response.data;
    return data as User;
  } catch (error) {
    throw new Error('Error creating user tag');
  }
};

const changeUserTag = async ({
  oldTag,
  newTag,
}: {
  oldTag: string;
  newTag: string;
}) => {
  try {
    const response = await baseInstance.request({
      url: '/users/tags',
      method: 'PUT',
      headers: {
        'X-API-KEY': process.env.API_KEY,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: { oldTag, newTag },
    });
    const data = await response.data;
    return data as User;
  } catch (error) {
    throw new Error('Error updating user tag');
  }
};

export { loginUser, addUser, addUserTag, changeUserTag };

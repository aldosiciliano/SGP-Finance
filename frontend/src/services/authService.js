import { get, post } from './httpService';
import { storageSet, storageRemove } from '../lib/chromeStorage';

export const getCurrentUser = () => get('/auth/me');

export const loginUser = async (credentials) => {
  const response = await post('/auth/login', credentials);
  
  if (response.access_token) {
    await storageSet('jwt_token', response.access_token);
    if (response.user) {
      await storageSet('user_data', JSON.stringify(response.user));
    }
  }
  
  return response;
};

export const registerUser = (payload) => post('/auth/register', payload);

export const logoutUser = async () => {
  try {
    await post('/auth/logout');
  } catch (error) {
  } finally {
    await storageRemove('jwt_token');
    await storageRemove('user_data');
  }
};

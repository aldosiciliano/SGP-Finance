import { get, post } from './httpService';

export const getCurrentUser = () => get('/auth/me');

export const loginUser = (credentials) => post('/auth/login', credentials);

export const registerUser = (payload) => post('/auth/register', payload);

export const logoutUser = () => post('/auth/logout');

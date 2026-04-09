import { get, post, put, remove } from './httpService';

export const getGastos = (params) => get('/gastos', { params });

export const createGasto = (payload) => post('/gastos/', payload);

export const updateGasto = (id, payload) => put(`/gastos/${id}`, payload);

export const deleteGasto = (id) => remove(`/gastos/${id}`);

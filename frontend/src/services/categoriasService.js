import { get, post } from './httpService';

export const getCategorias = () => get('/categorias');

export const createCategoria = (payload) => post('/categorias/', payload);
